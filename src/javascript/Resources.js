import * as THREE from 'three'

import Loader from './Utils/Loader.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Resources extends EventEmitter
{
    constructor()
    {
        super()
        this.loader = new Loader()
        this.items = {}

        this.loader.load([
            { name: 'matcapBeige', source: './models/matcaps/beige.png', type: 'texture' },
            { name: 'matcapBlack', source: './models/matcaps/black.png', type: 'texture' },
            { name: 'matcapOrange', source: './models/matcaps/orange.png', type: 'texture' },
            { name: 'matcapRed', source: './models/matcaps/red.png', type: 'texture' },
            { name: 'matcapWhite', source: './models/matcaps/white.png', type: 'texture' },
            { name: 'matcapGreen', source: './models/matcaps/green.png', type: 'texture' },
            { name: 'matcapBrown', source: './models/matcaps/brown.png', type: 'texture' },
            { name: 'matcapGray', source: './models/matcaps/gray.png', type: 'texture' },
            { name: 'matcapEmeraldGreen', source: './models/matcaps/emeraldGreen.png', type: 'texture' },
            { name: 'matcapPurple', source: './models/matcaps/purple.png', type: 'texture' },
            { name: 'matcapBlue', source: './models/matcaps/blue.png', type: 'texture' },
            { name: 'matcapYellow', source: './models/matcaps/yellow.png', type: 'texture' },
            { name: 'matcapMetal', source: './models/matcaps/metal.png', type: 'texture' },
            { name: 'matcapArcadeBase', source: './models/matcaps/Arcade_baseColor.png', type: 'texture'},
            { name: 'matcapGold', source: './models/matcaps/gold.png', type: 'texture' },
            { name: 'introStaticBase', source: './models/intro/static/base.glb' },
            { name: 'introStaticCollision', source: './models/intro/static/collision.glb' },
            { name: 'introInstructionsLabels', source: './models/intro/instructions/labels.glb' },
            { name: 'introInstructionsArrows', source: './models/intro/instructions/arrows.png', type: 'texture' },
            { name: 'introInstructionsControls', source: './models/intro/instructions/controls.png', type: 'texture' },
            { name: 'introInstructionsOther', source: './models/intro/instructions/other.png', type: 'texture' },
            { name: 'introArrowKeyBase', source: './models/intro/arrowKey/base.glb' },
            { name: 'introArrowKeyCollision', source: './models/intro/arrowKey/collision.glb' },
            { name: 'crossroadsStaticBase', source: './models/crossroads/static/base.glb' },
            { name: 'crossroadsStaticCollision', source: './models/crossroads/static/collision.glb' },
            { name: 'crossroadsStaticFloorShadow', source: './models/crossroads/static/floorShadow.png', type: 'texture' },
            { name: 'carCyberTruckChassis', source: './models/car/cyberTruck/chassis.glb' },
            { name: 'carCyberTruckWheel', source: './models/car/cyberTruck/wheel.glb' },
            { name: 'carCyberTruckBackLightsBrake', source: './models/car/cyberTruck/backLightsBrake.glb' },
            { name: 'carCyberTruckBackLightsReverse', source: './models/car/cyberTruck/backLightsReverse.glb' },
            { name: 'carCyberTruckAntena', source: './models/car/cyberTruck/antena.glb' },
            { name: 'projectsBoardStructure', source: './models/projects/board/structure.glb' },
            { name: 'projectsBoardCollision', source: './models/projects/board/collision.glb' },
            { name: 'projectsBoardStructureFloorShadow', source: './models/projects/board/floorShadow.png', type: 'texture' },
            { name: 'projectsBoardPlane', source: './models/projects/board/plane.glb' },
            { name: 'projectsUniverseFloor', source: './models/projects/universe/floorTexture.webp', type: 'texture' },
            { name: 'informationStaticBase', source: './models/information/static/base.glb' },
            { name: 'informationStaticCollision', source: './models/information/static/collision.glb' },
            { name: 'informationStaticFloorShadow', source: './models/information/static/floorShadow.png', type: 'texture' },
            { name: 'informationContactGithubLabel', source: './models/information/static/contactGithubLabel.png', type: 'texture' },
            { name: 'informationContactLinkedinLabel', source: './models/information/static/contactLinkedinLabel.png', type: 'texture' },
            { name: 'informationContactMailLabel', source: './models/information/static/contactMailLabel.png', type: 'texture' },
            { name: 'informationActivities', source: './models/information/static/activities.png', type: 'texture' },
            { name: 'hornBase', source: './models/horn/base.glb' },
            { name: 'hornCollision', source: './models/horn/collision.glb' },
            { name: 'areaKeyEnter', source: './models/area/keyEnter.png', type: 'texture' },
            { name: 'areaEnter', source: './models/area/enter.png', type: 'texture' },
            { name: 'areaOpen', source: './models/area/open.png', type: 'texture' },
            { name: 'areaReset', source: './models/area/reset.png', type: 'texture' },
            { name: 'areaQuestionMark', source: './models/area/questionMark.png', type: 'texture' },
            { name: 'tilesABase', source: './models/tiles/a/base.glb' },
            { name: 'tilesACollision', source: './models/tiles/a/collision.glb' },
            { name: 'tilesBBase', source: './models/tiles/a/base.glb' },
            { name: 'tilesBCollision', source: './models/tiles/a/collision.glb' },
            { name: 'tilesCBase', source: './models/tiles/a/base.glb' },
            { name: 'tilesCCollision', source: './models/tiles/a/collision.glb' },
            { name: 'tilesDBase', source: './models/tiles/a/base.glb' },
            { name: 'tilesDCollision', source: './models/tiles/a/collision.glb' },
            { name: 'tilesEBase', source: './models/tiles/a/base.glb' },
            { name: 'tilesECollision', source: './models/tiles/a/collision.glb' },
        ])

        this.loader.on('fileEnd', (_resource, _data) =>
        {
            this.items[_resource.name] = _data

            if (_resource.type === 'gltf')
            {
                    this.gltfLoader.load(_resource.source, (gltf) => {
                    this.items[_resource.name] = gltf
                    this.trigger('progress', [this.loader.loaded / this.loader.toLoad])
                })
            }
            else if (_resource.type === 'fbx') {
                this.FBXLoader.load(_resource.source, (fbx) => {
                    this.items[_resource.name] = fbx;
                    this.trigger('progress', [this.loader.loaded / this.loader.toLoad]);
                });
            }
            if(_resource.type === 'texture')
            {
                const texture = new THREE.Texture(_data)
                texture.needsUpdate = true

                this.items[`${_resource.name}Texture`] = texture
            }
            else{
                this.trigger('progress', [this.loader.loaded / this.loader.toLoad])
            }
        })

        this.loader.on('end', () =>
        {
            this.trigger('ready')
        })
    }
}
