export async function startCoroutine<T>(scene: Phaser.Scene, generatorFn: () => Generator) {

    const generator = generatorFn();

    const onUpdate = (time: number, delta: number) => {

        const { done, value} = generator.next();

        if (done) {
            scene.events.off("update", onUpdate);
            return;
        }

        console.log("onUpdate", time, delta);
    };
    scene.events.on("update", onUpdate);
}
