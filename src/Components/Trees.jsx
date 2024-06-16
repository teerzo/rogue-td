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
const data = Array.from({ length: max }, () => ({ 
    color: colours[Math.floor(Math.random() * colours.length + 1)], scale: 1 }))
// const data = Array.from({ length: max }, () => ({ scale: 1 }))
console.log(colours.length, Math.floor(Math.random() * colours.length + 1));


export default function Trees() {
    const [hovered, set] = useState()
    const colorArray = useMemo(() => Float32Array.from(new Array(max).fill().flatMap((_, i) => {
        console.log(i, Math.floor(max / 2));
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
                tempObject.position.set(5 - x, 0.5, 5 - z)
                tempObject.updateMatrix()
                meshRef.current.setMatrixAt(id, tempObject.matrix)
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true

    })

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        // meshRef.current.rotation.x = Math.sin(time / 4)
        // meshRef.current.rotation.y = Math.sin(time / 2)
        let i = 0
        for (let x = 0; x < width; x++) {
            //   for (let y = 0; y < 10; y++)
            for (let z = 0; z < height; z++) {
                const id = i++
                console.log('update', x, z, i);
                //   tempObject.position.set(5 - x, 0, 5 - z)
                //   tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(z / 4 + time)
                //   tempObject.rotation.z = tempObject.rotation.y * 2
                if (hovered !== prevRef.Current) {
                    ; (id === hovered ? tempColor.setRGB(10, 10, 10) : tempColor.set(data[id].color)).toArray(colorArray, id * 3)

                    //                     if (id === hovered) {
                    //                         tempColor.setRGB(10, 10, 10);
                    //                     }
                    //                     else {
                    //                         tempColor.set(data[id].color)).toArray(colorArray, id * 3);
                    // }
                    meshRef.current.geometry.attributes.color.needsUpdate = true
                }
                //   tempObject.updateMatrix()
                //   meshRef.current.setMatrixAt(id, tempObject.matrix)
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    })
    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, max]}
            onPointerMove={(e) => (e.stopPropagation(), set(e.instanceId), console.log('test'))}
            onPointerOut={(e) => set(undefined)}>
            <boxGeometry args={[0.6, 0.6, 0.6]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
            </boxGeometry>
            <meshBasicMaterial toneMapped={false} vertexColors />
        </instancedMesh>
    )
}
