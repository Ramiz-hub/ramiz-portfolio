import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export default class Car {
    constructor(_options) {
        this.setupOptions(_options);
        this.setupContainer();
        this.setupDebug();
        this.setupModels();
        this.setupMovement();
        this.setupChassis();
        this.setupBackLights();
        this.setupWheels();
        this.setupTransformControls();
        this.setupKlaxon();
    }

    setupOptions(_options) {
        const {
            time, resources, objects, physics, shadows, materials,
            controls, sounds, renderer, camera, debug, config
        } = _options;

        this.time = time;
        this.resources = resources;
        this.objects = objects;
        this.physics = physics;
        this.shadows = shadows;
        this.materials = materials;
        this.controls = controls;
        this.sounds = sounds;
        this.renderer = renderer;
        this.camera = camera;
        this.debug = debug;
        this.config = config;
        this.config.cyberTruck = true;
    }

    setupContainer() {
        this.container = new THREE.Object3D();
        this.position = new THREE.Vector3();
    }

    setupDebug() {
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('car');
        }
    }

    setupModels() {
        this.models = {
            chassis: this.resources.items.carCyberTruckChassis,
            backLightsBrake: this.resources.items.carCyberTruckBackLightsBrake,
            backLightsReverse: this.resources.items.carCyberTruckBackLightsReverse,
            wheel: this.resources.items.carCyberTruckWheel,
        };
    }

    setupMovement() {
        this.movement = {
            speed: new THREE.Vector3(),
            localSpeed: new THREE.Vector3(),
            acceleration: new THREE.Vector3(),
            localAcceleration: new THREE.Vector3(),
            lastScreech: 0,
        };

        const chatInput = document.getElementById('user-message');
        this.controlsEnabled = true;

        chatInput.addEventListener('focus', () => { this.controlsEnabled = false; });
        chatInput.addEventListener('blur', () => { this.controlsEnabled = true; });

        this.time.on('tick', () => {
            if (!this.controlsEnabled) return;

            const movementSpeed = new THREE.Vector3()
                .copy(this.chassis.object.position)
                .sub(this.chassis.oldPosition)
                .multiplyScalar(1 / this.time.delta * 17);

            this.movement.acceleration = movementSpeed.clone().sub(this.movement.speed);
            this.movement.speed.copy(movementSpeed);

            this.movement.localSpeed = this.movement.speed.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.chassis.object.rotation.z);
            this.movement.localAcceleration = this.movement.acceleration.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -this.chassis.object.rotation.z);

            this.updateEngineSound();
            this.playScreechSound();
        });
    }

    updateEngineSound() {
        this.sounds.engine.speed = this.movement.localSpeed.x;
        this.sounds.engine.acceleration = this.controls.actions.up ? (this.controls.actions.boost ? 1 : 0.5) : 0;
    }

    playScreechSound() {
        if (this.movement.localAcceleration.x > 0.03 && this.time.elapsed - this.movement.lastScreech > 5000) {
            this.movement.lastScreech = this.time.elapsed;
            this.sounds.play('screech');
        }
    }

    setupChassis() {
        this.chassis = {
            offset: new THREE.Vector3(0, 0, -0.28),
            object: this.objects.getConvertedMesh(this.models.chassis.scene.children),
            oldPosition: this.chassis ? this.chassis.object.position.clone() : new THREE.Vector3(),
        };

        this.chassis.object.position.copy(this.physics.car.chassis.body.position);
        this.container.add(this.chassis.object);

        this.shadows.add(this.chassis.object, { sizeX: 3, sizeY: 2, offsetZ: 0.2 });

        this.time.on('tick', () => {
            this.chassis.oldPosition.copy(this.chassis.object.position);

            if (!this.transformControls.enabled) {
                this.chassis.object.position.copy(this.physics.car.chassis.body.position).add(this.chassis.offset);
                this.chassis.object.quaternion.copy(this.physics.car.chassis.body.quaternion);
            }

            this.position.copy(this.chassis.object.position);
        });
    }

    setupBackLights() {
        this.backLightsBrake = this.createBackLight(this.models.backLightsBrake, this.materials.pures.items.red);
        this.backLightsReverse = this.createBackLight(this.models.backLightsReverse, this.materials.pures.items.yellow);

        this.time.on('tick', () => {
            this.backLightsBrake.material.opacity = this.physics.controls.actions.brake ? 1 : 0.5;
            this.backLightsReverse.material.opacity = this.physics.controls.actions.down ? 1 : 0.5;
        });
    }

    createBackLight(model, material) {
        const backLight = {
            material: material.clone(),
            object: this.objects.getConvertedMesh(model.scene.children),
        };

        backLight.material.transparent = true;
        backLight.material.opacity = 0.5;

        backLight.object.children.forEach(child => {
            child.material = backLight.material;
        });

        this.chassis.object.add(backLight.object);
        return backLight;
    }

    setupWheels() {
        this.wheels = {
            object: this.objects.getConvertedMesh(this.models.wheel.scene.children),
            items: [],
        };

        for (let i = 0; i < 4; i++) {
            const object = this.wheels.object.clone();
            this.wheels.items.push(object);
            this.container.add(object);
        }

        this.time.on('tick', () => {
            if (!this.transformControls.enabled) {
                this.wheels.items.forEach((wheelObject, i) => {
                    const wheelBody = this.physics.car.wheels.bodies[i];
                    wheelObject.position.copy(wheelBody.position);
                    wheelObject.quaternion.copy(wheelBody.quaternion);
                });
            }
        });
    }

    setupTransformControls() {
        this.transformControls = new TransformControls(this.camera.instance, this.renderer.domElement);
        this.transformControls.size = 0.5;
        this.transformControls.attach(this.chassis.object);
        this.transformControls.enabled = false;
        this.transformControls.visible = this.transformControls.enabled;

        document.addEventListener('keydown', (event) => {
            if (this.mode === 'transformControls') {
                if (event.key === 'r') {
                    this.transformControls.setMode('rotate');
                } else if (event.key === 'g') {
                    this.transformControls.setMode('translate');
                }
            }
        });

        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.camera.orbitControls.enabled = !event.value;
        });

        this.container.add(this.transformControls);

        if (this.debug) {
            const folder = this.debugFolder.addFolder('controls');
            folder.open();
            folder.add(this.transformControls, 'enabled').onChange(() => {
                this.transformControls.visible = this.transformControls.enabled;
            });
        }
    }

    setupKlaxon() {
        this.klaxon = { lastTime: this.time.elapsed };

        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyH' && this.time.elapsed - this.klaxon.lastTime > 400) {
                this.physics.car.jump(false, 150);
                this.klaxon.lastTime = this.time.elapsed;
                this.sounds.play(Math.random() < 0.002 ? 'carHorn2' : 'carHorn1');
            }
        });
    }
}
