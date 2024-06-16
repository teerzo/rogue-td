import * as THREE from 'three'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import niceColors from 'nice-color-palettes'

const width = 11;
const height = 11;
const max = width * height;

const midColour = '#FF0000';
const colours = ['#34eb49', '#1d912a', '#389642', '#518a33', '#7fa66a'];
const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const data = Array.from({ length: max }, () => ({ color: colours[Math.floor(Math.random() * colours.length + 1)], scale: 1 }))
// console.log(colours.length, Math.floor(Math.random() * colours.length+1));

// console.log('max', max);

export default function Floor() {
    const [hovered, set] = useState()

    const colorArray = useMemo(() => Float32Array.from(new Array(max).fill().flatMap((_, i) => {
        // console.log(i, Math.floor(max / 2));
        if (i === Math.floor(max / 2)) {
            return tempColor.set(midColour).toArray()
        }
        else {
            return tempColor.set(data[i].color).toArray()
        }

    }
    )), [])



    const meshRef = useRef()
    const prevRef = useRef()
    useEffect(() => void (prevRef.current = hovered), [hovered])

    useEffect(() => {
        let i = 0

        for (let x = 0; x < width; x++) {
            for (let z = 0; z < height; z++) {
                const id = i++
                tempObject.position.set(5 - x, 0, 5 - z)
                tempObject.rotation.x = -Math.PI / 2;

                tempObject.updateMatrix()
                meshRef.current.setMatrixAt(id, tempObject.matrix)

                if (hovered >= 0 && id === hovered) {
                    if (hovered !== prevRef.Current) {
                        console.log('hovered', id, hovered);
                        // ; tempColor.setRGB(10, 10, 10);
                        ; (id === hovered ? tempColor.setRGB(10, 10, 10) : tempColor.set(data[id].color)).toArray(colorArray, id * 3)
                
                    }
                }
                else {
                    ; (tempColor.set(data[id].color)).toArray(colorArray, id * 3)
                }

                // if (hovered >= 0 !== prevRef.Current) {
                //     ; (id === hovered ? tempColor.setRGB(10, 10, 10) : tempColor.set(data[id].color)).toArray(colorArray, id * 3)
                //     // meshRef.current.geometry.attributes.color.needsUpdate = true
                // }
            }
        }
meshRef.current.geometry.attributes.color.needsUpdate = true
meshRef.current.instanceMatrix.needsUpdate = true

    })

return (
    <instancedMesh
        ref={meshRef}
        args={[null, null, max]}
        onClick={(e) => (e.stopPropagation(), console.log('click', e.instanceId), set(e.instanceId))}
    // onPointerMove={(e) => (e.stopPropagation(), set(e.instanceId), console.log(e.instanceId))}
    // onPointerOut={(e) => set(undefined)}
    >
        <planeGeometry args={[0.9, 0.9]}>
            <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
        </planeGeometry>
        <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
)
}