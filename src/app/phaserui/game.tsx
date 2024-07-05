"use client";

import { useLayoutEffect, useRef } from "react"

import { Game } from "phaser";
import { Scene1 } from "@phaser/Scene1";

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    backgroundColor: '#028af8',
    scene: [
        Scene1,
    ]
};

export default function PhaserGame() {
    const container = useRef<HTMLDivElement>(null);
    const game = useRef<Game>();
    

    useLayoutEffect(( ) => {

        if (game.current === undefined)
        {
            game.current = new Game({...config, parent: container.current!});
        }
    
        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

        }
    }, []);
    
    return <div ref={container} />;
}
