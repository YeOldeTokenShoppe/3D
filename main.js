import "./styles/style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import TWEEN from "@tweenjs/tween.js";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const gltfLoader = new GLTFLoader();
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(
  10,
  sizes.width / sizes.height,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
});

const effect = new OutlineEffect(renderer, {
  defaultThickness: 0.00085,
  defaultColor: [0, 0, 0],
  defaultAlpha: 0.5,
  defaultKeepAlive: true,
  defaultVisible: true,
});

const controls = new OrbitControls(camera, canvas);
const minPan = new THREE.Vector3(-1, -1, -1);
const maxPan = new THREE.Vector3(1, 1, 1);
const clock = new THREE.Clock(),
  clockFF = new THREE.Clock();
let vampireMixer, vampireAnimations; // Already declared globally
let animations,
  animation01,
  animation02,
  animation03,
  mixer01,
  mixer02,
  mixer03,
  stake,
  isPlaying01 = false,
  isPlaying02 = false,
  candleISO;

const getCamera = () => {
  camera.position.x = 80;
  camera.position.y = 50;
  camera.position.z = 80;
  scene.add(camera);
};

const getRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
};

const getControls = () => {
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 50;
  controls.maxDistance = 180;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minAzimuthAngle = -Math.PI * 0.1;
  controls.maxAzimuthAngle = Math.PI * 0.5;
};

const getLights = () => {
  // scene.add(new THREE.AmbientLight(0xffffff, .025))
  scene.add(new THREE.AmbientLight(0x4b2e2a, 0.12));

  const lgBottom = new THREE.PointLight(0xff0000, 5, 8, 2);
  lgBottom.position.set(0, -6, -2);
  scene.add(lgBottom);

  const lgChest = new THREE.PointLight(0xe9c46a, 2, 2);
  lgChest.position.set(0, -6.5, 1);
  scene.add(lgChest);

  const lgCandelabra01 = new THREE.PointLight(0xffffff, 1, 5, 2);
  lgCandelabra01.position.set(6, -3, -4.5);
  scene.add(lgCandelabra01);

  const lgCandelabra02 = new THREE.PointLight(0xffffff, 2, 5, 2);
  lgCandelabra02.position.set(6.5, 3.5, 0);
  scene.add(lgCandelabra02);

  const lgCandelabra04 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra04.position.set(-7, -6, 4);
  scene.add(lgCandelabra04);

  const lgCandelabra05 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra05.position.set(-7, -4, 2);
  scene.add(lgCandelabra05);

  const lgCandelabra06 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra06.position.set(-7, -2, 0);
  scene.add(lgCandelabra06);

  const lgCandelabra07 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra07.position.set(-7, 0, -2);
  scene.add(lgCandelabra07);

  const lgCandelabra08 = new THREE.PointLight(0xffffff, 2.5, 12, 3);
  lgCandelabra08.position.set(-1, 4, -4);
  scene.add(lgCandelabra08);

  const lgCandelabra09 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra09.position.set(-7, -2, 2);
  scene.add(lgCandelabra09);

  const lgCandelabra10 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra10.position.set(-7, 0, 0);
  scene.add(lgCandelabra10);

  const lgCandelabra11 = new THREE.PointLight(0xffffff, 0.4, 5, 3);
  lgCandelabra11.position.set(-7, 2, -2);
  scene.add(lgCandelabra11);

  const lgFire01 = new THREE.PointLight(0xf4a261, 0.75, 5, 2);
  lgFire01.position.set(-2, -5.5, -4.5);
  scene.add(lgFire01);

  const lgFire02 = new THREE.PointLight(0xf4a261, 0.75, 5, 2);
  lgFire02.position.set(2, -5.5, -4.5);
  scene.add(lgFire02);

  const lgFire03 = new THREE.PointLight(0xf4a261, 2.5, 7, 2);
  lgFire03.position.set(5, 3.5, -4.5);
  scene.add(lgFire03);

  const lgFire04 = new THREE.PointLight(0xf4a261, 2.5, 4, 2);
  lgFire04.position.set(-5, 2.5, -4.5);
  scene.add(lgFire04);

  const lgFire05 = new THREE.PointLight(0xf4a261, 2.5, 4, 2);
  lgFire05.position.set(-5, 2.5, 1);
  scene.add(lgFire05);

  const lgFire06 = new THREE.PointLight(0xf4a261, 1.45, 5, 2);
  lgFire06.position.set(0, -6, 3);
  scene.add(lgFire06);

  const lgFire07 = new THREE.PointLight(0xffffff, 0.5, 2, 1);
  lgFire07.position.set(6, -4.75, 4);
  scene.add(lgFire07);
};

const candleMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe9c46a,
  emissiveIntensity: 1,
});

const candleISOMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe63946,
  emissiveIntensity: 1,
});

const fireMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xe36414,
  emissiveIntensity: 1,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: 0xffe2d1,
  roughness: 0.35,
  metalness: 0.1,
});

const loader = new THREE.TextureLoader();
const heart = loader.load("heart.png");
const heartMaterial = new THREE.MeshStandardMaterial({
  map: heart,
  transparent: true,
});

const noise = loader.load("noise.jpg");
const noiseMaterial = new THREE.MeshStandardMaterial({
  map: noise,
  transparent: true,
});

const getModel = () => {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.src =
    "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room14/a50f65020e8781fc118b6626a3bd6044482dd478/static/video.mp4";
  video.play();
  video.setAttribute("crossorigin", "anonymous");

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.crossOrigin = "anonymous";

  const videoMaterial = new THREE.MeshStandardMaterial({
    map: videoTexture,
    side: THREE.FrontSide,
    toneMapped: false,
  });

  gltfLoader.load("room.glb", (gltf) => {
    gltf.scene.traverse((child) => {
      //    child.material = concreteMaterial
      child.material = noiseMaterial;
    });
    scene.add(gltf.scene);
    scene.add(camera);
  });

  gltfLoader.load("items.glb", (gltf) => {
    scene.add(gltf.scene);
  });

  gltfLoader.load("coffin.glb", (gltf) => {
    animations = gltf.animations;
    mixer01 = new THREE.AnimationMixer(gltf.scene);
    animation01 = mixer01.clipAction(animations[0]);
    scene.add(gltf.scene);
  });
  gltfLoader.load(
    "vampire.glb",
    (gltf) => {
      const vampire = gltf.scene;
      vampireAnimations = gltf.animations;

      vampire.scale.set(1.1, 1.1, 1.1);
      vampire.position.set(0.2, -6.0, -11.1);
      vampire.rotation.set(0, Math.PI, 0);

      vampireMixer = new THREE.AnimationMixer(vampire);

      // Helper function to remove the first keyframe from each track
      const removeFirstKeyframe = (clip) => {
        clip.tracks.forEach((track) => {
          track.times = track.times.slice(1);
          track.values = track.values.slice(track.getValueSize());
        });
        clip.resetDuration();
      };

      const idleClip = vampireAnimations.find((anim) => anim.name === "idle");
      const walkClip = vampireAnimations.find((anim) => anim.name === "Walk");
      const attackClip = vampireAnimations.find(
        (anim) => anim.name === "attack"
      );

      if (!idleClip || !walkClip || !attackClip) {
        console.error("Error: Missing one or more animations.");
        return;
      }

      // Remove the first keyframe from each clip
      removeFirstKeyframe(idleClip);
      removeFirstKeyframe(walkClip);
      removeFirstKeyframe(attackClip);

      const idleAction = vampireMixer.clipAction(idleClip);
      const walkAction = vampireMixer.clipAction(walkClip);
      const attackAction = vampireMixer.clipAction(attackClip);

      attackAction.setLoop(THREE.LoopOnce);
      attackAction.clampWhenFinished = true;

      // Play the base idle animation first
      idleAction.play();

      // Function to smoothly switch animations
      const switchAnimation = (fromClip, toClip) => {
        fromClip.fadeOut(1); // Fade out the current clip
        toClip.reset().fadeIn(1).play(); // Fade in the new clip
      };

      // Move vampire forward and slightly down during Walk animation
      const moveVampireForwardAndDown = () => {
        const moveSpeed = 0.02; // Adjust for forward movement speed
        const downSpeed = 0.003; // Adjust for downward movement speed
        const intervalId = setInterval(() => {
          vampire.position.z += moveSpeed; // Move forward
          vampire.position.y -= downSpeed; // Move slightly down

          // Stop the movement when the vampire has moved a certain distance
          if (vampire.position.z >= -8.2) {
            clearInterval(intervalId); // Stop moving forward
            switchAnimation(walkAction, attackAction); // Start the attack animation
          }
        }, 16); // Runs approximately every frame (60fps)
      };

      // Event listener to trigger animation on coffin click
      const onCoffinClick = (event) => {
        const coords = new THREE.Vector2(
          (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
          -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
        );

        raycaster.setFromCamera(coords, camera);
        const intersections = raycaster.intersectObjects(scene.children, true);

        if (intersections.length > 0) {
          const selectedObject = intersections[0].object;

          // Check if the clicked object is the coffin
          if (
            selectedObject.name === "Plane001" ||
            selectedObject.parent.name === "Coffin"
          ) {
            console.log("Coffin clicked! Starting vampire animation...");

            // Keep the vampire in idle for 3 more seconds before starting to walk
            setTimeout(() => {
              switchAnimation(idleAction, walkAction);

              // Start moving the vampire forward and down during the Walk animation
              moveVampireForwardAndDown();
            }, 5000); // Wait for 3 seconds before switching to Walk
          }
        }
      };

      // Add event listener to trigger animation on click
      document.addEventListener("mousedown", onCoffinClick);

      // Add vampire to the scene
      scene.add(vampire);
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the vampire:", error);
    }
  );
  gltfLoader.load("chest.glb", (gltf) => {
    animations = gltf.animations;
    mixer02 = new THREE.AnimationMixer(gltf.scene);
    animation02 = mixer02.clipAction(animations[0]);
    scene.add(gltf.scene);
  });

  gltfLoader.load("stake.glb", (gltf) => {
    stake = gltf.scene;
    scene.add(gltf.scene);
  });

  gltfLoader.load("fire.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = fireMaterial));
    scene.add(gltf.scene);
  });

  gltfLoader.load("maryGLB.glb", (gltf) => {
    gltf.scene.scale.set(3.5, 3.5, 3.5);
    gltf.scene.position.x = 5.5;
    gltf.scene.position.z = -6.5;
    gltf.scene.position.y = 2;
    gltf.scene.rotation.y = 0.5;
    scene.add(gltf.scene);
  });

  gltfLoader.load("heart.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = heartMaterial));
    scene.add(gltf.scene);
  });

  gltfLoader.load("laptop.glb", (gltf) => {
    gltf.scene.scale.set(0.05, 0.05, 0.05);
    gltf.scene.position.y = 2.25;
    gltf.scene.position.z = -4;
    gltf.scene.position.x = 0.25;
    scene.add(gltf.scene);
  });

  gltfLoader.load("chair.glb", (gltf) => {
    gltf.scene.scale.set(0.41, 0.41, 0.41);
    gltf.scene.position.z = -1.5;
    gltf.scene.position.x = -1;
    scene.add(gltf.scene);
  });

  gltfLoader.load("candle.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = candleMaterial));
    scene.add(gltf.scene);
  });

  gltfLoader.load("candleISO.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = candleISOMaterial));
    candleISO = gltf.scene;
    scene.add(gltf.scene);
    gltf.scene.position.y = -1000;
  });

  gltfLoader.load("screen01.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen02.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen03.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen04.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen05.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
  gltfLoader.load("screen06.glb", (gltf) => {
    gltf.scene.traverse((child) => (child.material = videoMaterial));
    scene.add(gltf.scene);
  });
};

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 10 },
  },
  vertexShader: document.getElementById("vertexshader").textContent,
  fragmentShader: document.getElementById("fragmentshader").textContent,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const getFireflies = () => {
  const firefliesGeometry = new THREE.BufferGeometry();
  const firefliesCount = 40;
  const positionArray = new Float32Array(firefliesCount * 3);
  const scaleArray = new Float32Array(firefliesCount * 1);

  for (let i = 0; i < firefliesCount; i++) {
    new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      1 + Math.random() * 2 * 2,
      -2 + (Math.random() - 0.5) * 8
    ).toArray(positionArray, i * 3);

    scaleArray[i] = Math.random();
    scaleArray[i] = Math.random();
  }

  firefliesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  firefliesGeometry.setAttribute(
    "aScale",
    new THREE.BufferAttribute(scaleArray, 1)
  );

  const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
  scene.add(fireflies);
};

getFireflies();

const onMouseDown = (event) => {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    if (
      selectedObject.name == "Plane001" ||
      selectedObject.name == "Plane001_1"
    ) {
      animation01.repetitions = 1;

      if (!isPlaying01) {
        mixer01.timeScale = 1;
        animation01.reset().play();
        isPlaying01 = true;
        animation01.clampWhenFinished = true;
      } else {
        mixer01.timeScale = -1;
        animation01.reset().play();
        isPlaying01 = false;
      }
    }

    if (selectedObject.name === "StakeBAse") {
      console.log("StakeBAse was clicked!");

      // Traverse the stake object to find the actual stake mesh
      let actualStakeMesh;
      stake.traverse((child) => {
        if (child.isMesh) {
          actualStakeMesh = child; // Assuming the stake is a mesh
          console.log("Actual Stake Mesh found:", actualStakeMesh);
        }
      });

      if (actualStakeMesh) {
        console.log("Starting manual movement for the stake...");

        // Perform a simple manual movement along the y-axis to test
        actualStakeMesh.position.y += 1; // Move the stake up by 1 unit
        console.log("New stake position:", actualStakeMesh.position);

        // Simple linear tween test
        const moveUp = new TWEEN.Tween(actualStakeMesh.position)
          .to({ y: actualStakeMesh.position.y + 1 }, 2000) // Move up by 1 unit over 2 seconds
          .onUpdate(() => {
            console.log("Stake position moving up:", actualStakeMesh.position);
          })
          .start();
      } else {
        console.error("Actual Stake Mesh not found.");
      }
    }

    if (selectedObject.name == "CandleBase056") {
      scene.remove(selectedObject.parent);
    }
    console.log(`${selectedObject.name} was clicked!`);
  }
};

const animate = () => {
  requestAnimationFrame(animate);

  const elapsedTime = clockFF.getElapsedTime();
  let delta = clock.getDelta();
  controls.update();
  firefliesMaterial.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);
  effect.render(scene, camera);

  if (mixer01) mixer01.update(delta);
  if (mixer02) mixer02.update(delta);
  if (mixer03) mixer03.update(delta);
  if (vampireMixer) vampireMixer.update(delta);

  // Ensure this line is included to update the tweens
  TWEEN.update();
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

document.addEventListener("mousedown", onMouseDown);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();

window.addEventListener("mousemove", (e) => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

window.addEventListener("dblclick", () => {
  const sphereGEO = candleISO.clone();
  scene.add(sphereGEO);
  const { x, y, z } = intersectionPoint;
  sphereGEO.position.copy(new THREE.Vector3(x, 0.5, z));

  //remove the candle after 2 seconds
  // setTimeout(()=>{
  //     sphereGEO.visible = false
  // }, 2000)
});

getModel();
getRenderer();
getCamera();
getControls();
getLights();
animate();
