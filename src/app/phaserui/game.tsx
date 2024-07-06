"use client";

import { useLayoutEffect, useRef } from "react"

import { Game } from "phaser";
import { Scene1 } from "@phaser/Scene1";

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    transparent: true,
    scene: [
        Scene1,
    ],
    scale: {
        mode: Phaser.Scale.NONE,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
};

export default function PhaserGame() {
    const container = useRef<HTMLDivElement>(null);
    const game = useRef<Game>();
    

    useLayoutEffect(( ) => {

        if (game.current === undefined)
        {
            game.current = new Game({...config, parent: container.current!});
        }

        const resize = () => {
            const aspectRatio = container.current!.clientWidth / container.current!.clientHeight;
            const fitWidth = 768 * aspectRatio;

            game.current?.scale.resize(Math.max(1024, fitWidth), 768);
        };


        window.addEventListener("resize", resize);
        resize();

    
        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

            window.removeEventListener("resize", resize);
        }
    }, []);
    
    return <div ref={container} className="w-full h-full flex items-center overflow-x-hidden [&>canvas]:h-full" />;
}
