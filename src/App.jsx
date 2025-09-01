import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Loader } from "@react-three/drei";
import { Lipsync } from "wawa-lipsync";
import { UI } from "./components/UI";
export const lipsyncManager = new Lipsync({});

function App() {
  return (
    <>
      <Loader />
      <UI />
      {/* <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas> */}
    </>
  );
}

export default App;
