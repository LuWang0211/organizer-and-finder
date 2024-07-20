"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

import { Game } from "phaser";
import { UIScene } from "@phaser/UIScene";

import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin';
import AnchorPlugin from 'phaser3-rex-plugins/plugins/anchor-plugin';

import { useMeasure } from "react-use";
import { LoaderScene } from "./scenes/LoaderScene";

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    transparent: true,
    scene: [
        LoaderScene,
        UIScene,
    ],
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.NONE,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 300 },
            debug: false
        }
    },
    // ...
    plugins: {
        scene: [
            {
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }],

        global: [
        {
            key: 'rexInputTextPlugin',
            plugin: InputTextPlugin ,
            start: true
        },
        {
            key: 'rexAnchor',
            plugin: AnchorPlugin,
            start: true
        }]
    }
};

export default function PhaserGame() {
    const game = useRef<Game>();

    const container = useRef<HTMLDivElement>();

    // useMeasure is a 3rd party hook that measures the size of a DOM element
    const [containerMeasure, { width: containerWidth, height: containerHeight }] = useMeasure<HTMLDivElement>();

    // assignRef will transfer the DOM reference to both the container ref and the containerMeasure ref
    const assignRef = useCallback((element: HTMLDivElement) => {
        containerMeasure(element);
        container.current = element;
    }, []);


    useLayoutEffect(() => {

        if (game.current === undefined) {

            console.log("Creating game");
            
            game.current = new Game({
                ...config, parent: container.current, input: {
                    mouse: {
                        target: container.current
                    },
                    touch: {
                        target: container.current
                    },
                }
            });
        }

        return () => {

            if (game.current) {

                game.current.plugins.removeGlobalPlugin("rexInputTextPlugin");
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, []);

    useEffect(() => {
        // Resize the game to fit the container,
        // this might change the intiial aspect ratio
        if (containerWidth > 0 && containerHeight > 0) {
            const containerAspectRatio = containerWidth / containerHeight;
            const fitWidth = 768 * containerAspectRatio;

            game.current?.scale.resize(fitWidth, 768);
            game.current?.scale.setZoom(containerHeight / 768);
        }
    }, [containerWidth, containerHeight]);

    return <div ref={assignRef} className="w-full h-full relative overflow-x-hidden" />;
}
