import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const Molecules = ({ selectedMof, w, h }) => {
  const map = {
    'hMOF-0': 'hMOF-0',
    'hMOF-1': 'cocaine',
    'hMOF-2': 'cholesterol',
    'hMOF-3': 'diamond',
    'hMOF-4': 'glucose',
    'hMOF-5': 'graphite',
    'hMOF-6': 'lsd',
    'hMOF-7': 'lycopene',
    'hMOF-8': 'nicotine',
    'hMOF-9': 'ala_phe_ala',
    'hMOF-10': 'Al2O3',
    'hMOF-11': 'aspirin',
    'hMOF-12': 'buckyball',
    'hMOF-13': 'caf2',
    'hMOF-14': 'cu',
    'hMOF-15': 'cubane',
  };

  const fileName = map[selectedMof] ? `${map[selectedMof]}.pdb` : `${selectedMof}.pdb`;

  const [molecule, setMolecule] = useState(fileName);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef(null);
  const [scene, setScene] = useState(new THREE.Scene());
  const [root, setRoot] = useState(new THREE.Group());
  const [renderer, setRenderer] = useState(new THREE.WebGLRenderer({ alpha: true }));

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  let camera, labelRenderer;
  let controls;

  const loader = new PDBLoader();
  const offset = new THREE.Vector3();

  useEffect(() => {
    const fileName = map[selectedMof] ? `${map[selectedMof]}.pdb` : selectedMof;
    loadMolecule(fileName);
  }, [selectedMof]);

  useEffect(() => {
    init();
    animate();
  }, []);

  function init() {
    scene.background = new THREE.Color(0x050505);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;
    scene.add(camera);

    const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
    light2.position.set(-1, -1, 1);
    scene.add(light2);

    scene.add(root);

    renderer.setPixelRatio(window.devicePixelRatio);
    // const w = containerRef.current.offsetWidth - 50;
    renderer.setSize(w, h);
    document.getElementById('container').appendChild(renderer.domElement);
    document.getElementById('container').appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(w, h);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('container').appendChild(labelRenderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 2000;

    loadMolecule(molecule);
  }

  function loadMolecule(model) {
    const url = 'models/' + model;

    while (root.children.length > 0) {
      const object = root.children[0];
      object.parent.remove(object);
    }

    loader.load(url, (pdb) => {
      const geometryAtoms = pdb.geometryAtoms;
      const geometryBonds = pdb.geometryBonds;
      const json = pdb.json;

      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

      geometryAtoms.computeBoundingBox();
      geometryAtoms.boundingBox.getCenter(offset).negate();

      geometryAtoms.translate(offset.x, offset.y, offset.z);
      geometryBonds.translate(offset.x, offset.y, offset.z);

      let positions = geometryAtoms.getAttribute('position');
      const colors = geometryAtoms.getAttribute('color');

      const position = new THREE.Vector3();
      const color = new THREE.Color();

      for (let i = 0; i < positions.count; i++) {
        position.x = positions.getX(i);
        position.y = positions.getY(i);
        position.z = positions.getZ(i);

        color.r = colors.getX(i);
        color.g = colors.getY(i);
        color.b = colors.getZ(i);

        const material = new THREE.MeshPhongMaterial({ color: color });

        const object = new THREE.Mesh(sphereGeometry, material);
        object.position.copy(position);
        object.position.multiplyScalar(75);
        object.scale.multiplyScalar(25);
        root.add(object);

        const atom = json.atoms[i];

        const text = document.createElement('div');
        text.className = 'label';
        text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
        text.textContent = atom[4];

        const label = new CSS2DObject(text);
        label.position.copy(object.position);
        root.add(label);
      }

      positions = geometryBonds.getAttribute('position');

      const start = new THREE.Vector3();
      const end = new THREE.Vector3();

      for (let i = 0; i < positions.count; i += 2) {
        start.x = positions.getX(i);
        start.y = positions.getY(i);
        start.z = positions.getZ(i);

        end.x = positions.getX(i + 1);
        end.y = positions.getY(i + 1);
        end.z = positions.getZ(i + 1);

        start.multiplyScalar(75);
        end.multiplyScalar(75);

        const object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial(0xffffff));
        object.position.copy(start);
        object.position.lerp(end, 0.5);
        object.scale.set(5, 5, start.distanceTo(end));
        object.lookAt(end);
        root.add(object);
      }

      render();
    });
  }

  function animate() {
    var icon = document.getElementById('playPauseIcon');
    const isAnimating = icon && icon.classList.contains('fa-pause');

    requestAnimationFrame(animate);
    controls.update();

    if (isAnimating) {
      const time = Date.now() * 0.0004;

      root.rotation.x = time;
      root.rotation.y = time * 0.7;
    }

    render();
  }

  function render() {
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }

  return (
    <>
      <div ref={containerRef} id="container" style={{ position: 'relative', width: '100%' }}>
        <button
          style={{
            position: 'absolute',
            top: '17px',
            right: '80px',
            zIndex: 1000, // High z-index
            padding: '10px',
            pointerEvents: 'none',
            border: 'none',
            opacity: 0.8,
            borderRadius: '5px',
            color: '#fff', // Text color
            backgroundColor: '#007bff', // Button color
          }}
        >
          {selectedMof}
        </button>
        <button
          onClick={toggleAnimation}
          id="playPauseButton"
          className="btn btn-primary play-pause-button"
          style={{ opacity: 0.8 }}
        >
          {isAnimating ? <i id="playPauseIcon" className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
        </button>
      </div>
    </>
  );
};

export default Molecules;
