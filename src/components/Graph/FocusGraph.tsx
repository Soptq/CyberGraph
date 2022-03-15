// import dynamic from "next/dynamic";
import { GraphLink, useGraph } from "@/context/GraphContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as THREE from "three";
import { Vector2 } from "three";

const FocusGraph = () => {
    const fgRef = useRef<ForceGraphMethods>();
    const { graphData, setSelectAddress } = useGraph();

    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());

    console.log(highlightNodes, highlightLinks);

    useEffect(() => {
        const fg = fgRef.current;
        // add bloom effect
        const bloomPass = new UnrealBloomPass(new Vector2(256, 256), 1, 1, 0.1);
        fg?.postProcessingComposer().addPass(bloomPass);
        return () => {
            fg?.postProcessingComposer().removePass(bloomPass);
        };
    }, []);

    const handleClick = useCallback(
        (node) => {
            highlightNodes.clear();
            highlightLinks.clear();
            if (node) {
                highlightNodes.add(node.id);
                node.neighbors.forEach((neighbor: string) =>
                    highlightNodes.add(neighbor)
                );
                node.links.forEach((link: GraphLink) =>
                    highlightLinks.add(link)
                );
            }
            updateHighlight();

            const distance = 90;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
            if (fgRef.current) {
                fgRef.current.cameraPosition(
                    {
                        x: node.x * distRatio,
                        y: node.y * distRatio,
                        z: node.z * distRatio,
                    },
                    node,
                    3000
                );
            }
            setSelectAddress(node.id);
        },
        [fgRef, setSelectAddress]
    );

    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    const getLinkLabel = useCallback((link: any) => {
        const categories = {
            0: "Others",
            1: "Followings",
            2: "Followers",
            3: "Friends",
        };
        // @ts-ignore
        return categories[link.value];
    }, []);

    const getNodeThreeObject = useCallback(
        (node: any) => {
            const localImgs = [
                "/red.jpg",
                "/blue.png",
                "/brown.png",
                "/green.png",
                "/grey.png",
            ];

            const imgTexture = new THREE.TextureLoader().load(
                node.img || localImgs[getRandomInt(localImgs.length)]
                // Randomly give one
            );
            const geometry = new THREE.SphereGeometry(2, 6, 6);

            const material = new THREE.MeshBasicMaterial({
                map: imgTexture,
            });
            return new THREE.Mesh(geometry, material);
        },
        [graphData]
    );

    return (
        <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="id"
            nodeAutoColorBy="group"
            onNodeClick={handleClick}
            linkLabel={getLinkLabel}
            linkColor={(link) =>
                highlightLinks.has(link) ? "#ec407a" : "#458888"
            }
            linkWidth={(link) => (highlightLinks.has(link) ? 1.5 : 1.0)}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.001}
            linkDirectionalParticleWidth={(link) =>
                highlightLinks.has(link) ? 1.0 : 0.0
            }
            backgroundColor="#000000"
            nodeThreeObject={getNodeThreeObject}
        />
    );
};

export default FocusGraph;
