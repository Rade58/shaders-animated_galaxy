import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
// ------------------------------------------------------
// ------ Handling the size ------
// we want to hadne gl_PointSize with gui, so we need to define
// uniform uSize

// We will also add new attribute, called `aScale`
// so far we have two, a `position` and `color`
// we are adding scale attribute because we want
// to provide some randomness

// if you have screen with pixel ratio 1,
// the particles will look 2 times bigger than
// if you had a screen with a pixel ratio of 2
// because of that we will get pixel ratio with
// `renderer.getPixelRatio()` and we will pass it to
// vertex shader

// we won't use `window.devicePixelRatio`
// because we provided limit of 2 when we initially
// set pixel ratio with renderer (
// Math.min(window.devicePixelRatio, 2))
// User that have more than 2 would experience error
// if we would use window.devicePixelRatio in this case
// so we use `renderer.getPixelRatio()`

// we will multiply uSize with `renderer.getPixelRatio()`
// in threejs, not inside vertex shader
// so uSize inside shader will be a value that is already
// multiplied by pixel ratio

// ------------------------------------------------------

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

// gui.hide(); //

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  const scene = new THREE.Scene();

  // -------------------------------------------------------
  // -------------------------------------------------------

  /**
   * @name Parameters
   */
  const parameters = {
    count: 1000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 0,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
    //
    //
    uSize: 4,
  };
  parameters.count = 100000;
  parameters.size = 0.02;

  /**
   * @name Gui
   */
  gui
    .add(parameters, "count")
    .min(10)
    .max(1000000)
    .step(100)
    .onFinishChange(generateGalaxy);
  // disabling this one too
  /*  gui
    .add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy); */
  gui
    .add(parameters, "radius")
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
  // disabling this
  /* gui
    .add(parameters, "spin")
    .min(-5)
    .max(5)
    // .step(0.01)
    .step(1)
    .onFinishChange(generateGalaxy); */
  gui
    .add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
  gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

  // We added this one
  gui
    .add(parameters, "uSize")
    .min(0)
    .max(8)
    .step(1)
    .onFinishChange(generateGalaxy);

  // for cleanup of old glaxies
  let geometry: THREE.BufferGeometry | null = null;
  // let material: THREE.PointsMaterial | null = null;
  let material: THREE.ShaderMaterial | null = null;
  let points: THREE.Points | null = null;
  //

  /**
   * @name Galaxy
   */
  function generateGalaxy(/* renderer: THREE.WebGLRenderer */) {
    // cleanup
    if (points !== null) {
      // not working
      scene.remove(points);
      // use this
      (points as THREE.Points).remove();

      (geometry as THREE.BufferGeometry).dispose();
      (material as THREE.ShaderMaterial).dispose();
    }

    //

    console.log("generate galaxy");

    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3); // *3 because we need 3 coordiantes for every vertice
    const colors = new Float32Array(parameters.count * 3);
    // adding this array
    // ------------------------------------
    const scales = new Float32Array(parameters.count * 1); // one value per vertex
    // ------------------------------------

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;

      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2; // PI * 2 is full crcle

      const spinAngle = radius * parameters.spin;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = 0 + randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[0 + i3] = mixedColor.r;
      colors[1 + i3] = mixedColor.g;
      colors[2 + i3] = mixedColor.b;

      // adding random values
      // ---------------------------------------------------
      scales[i] = Math.random();
      // ---------------------------------------------------
    }
    // let'e see what is added to array
    console.log({ scales });

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    // setting new attribute called `aScale`
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    material = new THREE.ShaderMaterial({
      //
      vertexShader,
      fragmentShader,
      // uniform
      uniforms: {
        uSize: { value: parameters.uSize * renderer.getPixelRatio() },
      },
      //
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    points = new THREE.Points(geometry, material);

    scene.add(points);
  }

  // moved this bellow the place where you instatiated renderer
  // generateGalaxy();

  // -------------------------------------------------------
  // -------------------------------------------------------

  // -------------------------------------------------------
  // -------------------------------------------------------

  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 30);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 6;
  camera.position.x = 1;
  camera.position.y = 1;
  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  // scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  // handle pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  //
  generateGalaxy(/* renderer */);

  //

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  // ------------------------------------------------------
  // --------------- handle resize ------------------------
  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ------------------------------------------------------
  // ----------------- enter fulll screen with double click

  window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  });
}
