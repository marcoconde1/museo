// src/components/Modelo3D.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Modelo3D = ({ ruta, fondo }) => {

  const modeloUrl = ruta; // Mapear prop `ruta` a `modeloUrl`
  const fondoUrl = fondo; // Mapear prop `fondo` a `fondoUrl`
  const refContenedor = useRef();

  useEffect(() => {
    const contenedor = refContenedor.current;
    const scene = new THREE.Scene();

    // Fondo desde URL dinámica
    const texturaFondo = new THREE.TextureLoader().load(fondoUrl);
    scene.background = texturaFondo;

    const camera = new THREE.PerspectiveCamera(75, contenedor.clientWidth / contenedor.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(contenedor.clientWidth, contenedor.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    contenedor.innerHTML = '';
    contenedor.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Iluminación
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(-5, 5, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Carga del modelo 3D
    const extension = modeloUrl.split('.').pop().toLowerCase();

    if (extension === 'obj') {
      const mtlLoader = new MTLLoader();
      const basePath = modeloUrl.substring(0, modeloUrl.lastIndexOf('/') + 1);
      const nombre = modeloUrl.split('/').pop().replace('.obj', '');

      mtlLoader.setPath(basePath);
      mtlLoader.load(`${nombre}.mtl`, (materiales) => {
        materiales.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materiales);
        objLoader.setPath(basePath);
        objLoader.load(`${nombre}.obj`, (obj) => {
          obj.scale.set(1, 1, 1);
          obj.position.set(0, 0, 0);
          scene.add(obj);
        });
      });
    } else if (extension === 'fbx') {
      const loader = new FBXLoader();
      loader.load(modeloUrl, (modelo) => {
        modelo.scale.set(1, 1, 1);
        modelo.position.set(0, 0, 0);
        scene.add(modelo);
      });
    } else if (extension === 'glb' || extension === 'gltf') {
      const loader = new GLTFLoader();
      loader.load(modeloUrl, (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model);
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = contenedor.clientWidth / contenedor.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(contenedor.clientWidth, contenedor.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [modeloUrl, fondoUrl]);

  return <div ref={refContenedor} style={{ width: '100%', height: '90vh' }} />;
};

export default Modelo3D;
