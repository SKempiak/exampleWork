import { getCurrentRealm } from '@decentraland/EnvironmentAPI';
import { getUserData } from "@decentraland/Identity"
import { getPlayerData, getPlayersInScene } from '@decentraland/Players';
import { movePlayerTo } from '@decentraland/RestrictedActions';


const openPos: Quaternion = Quaternion.Euler(0, 90, 0)
const closedPos: Quaternion = Quaternion.Euler(0, 0, 0)
const entrySign = new Entity();
const exitButton = new Entity()
entrySign.addComponent(new GLTFShape("models/entrySign.glb"))
entrySign.addComponent(
  new Transform({
    position: new Vector3(2.0, 1.2, 2.96),
    rotation: new Quaternion(0, 90, 0, 90)
  })
)
engine.addEntity(entrySign)

const portrait1 = new Entity();
portrait1.addComponent(new GLTFShape("models/portrait1.glb"))
portrait1.addComponent(
  new Transform({
    position: new Vector3(5.98, 1.45, 5),
    rotation: new Quaternion(0, 180, 0, 0)
  })
)

const coolKatana = new Entity();
coolKatana.addComponent(new GLTFShape("models/Katana.glb"))
coolKatana.addComponent(
  new Transform({
    position: new Vector3(5.7, 1.35, 5),
    rotation: new Quaternion(-120, 180, -180, 120)
  })
)

let nftOwned = false;
const respawner = new Entity()


// Add actual door to scene. This entity doesn't rotate, its parent drags it with it.
const door = new Entity()
door.addComponent(
  new Transform({
    position: new Vector3(4.5, 1, 3),
    scale: new Vector3(1, 3, 0.05)
  })
)
door.addComponent(new BoxShape())
engine.addEntity(door)

// Define a material to color the door red
const doorMaterial = new Material()
doorMaterial.albedoColor = Color3.Red()
doorMaterial.metallic = 0.9
doorMaterial.roughness = 0.1

// Assign the material to the door
door.addComponent(doorMaterial)

// Define fixed walls
const wall1 = new Entity()
wall1.addComponent(
  new Transform({
    position: new Vector3(5.5, 1, 3),
    scale: new Vector3(1, 3, 0.05)
  })
)
wall1.addComponent(new BoxShape())
engine.addEntity(wall1)

const wall2 = new Entity()
wall2.addComponent(
  new Transform({
    position: new Vector3(2, 1, 3),
    scale: new Vector3(4, 3, 0.05)
  })
)
wall2.addComponent(new BoxShape())
engine.addEntity(wall2)

const wall3 = new Entity()
wall3.addComponent(
  new Transform({
    position: new Vector3(0, 1, 5),
    scale: new Vector3(0.05, 3, 4)
  })
)
wall3.addComponent(new BoxShape())
engine.addEntity(wall3)

const wall4 = new Entity()
wall4.addComponent(
  new Transform({
    position: new Vector3(6, 1, 5),
    scale: new Vector3(0.05, 3, 4)
  })
)
wall4.addComponent(new BoxShape())
engine.addEntity(wall4)

const wall5 = new Entity()
wall5.addComponent(
  new Transform({
    position: new Vector3(3, 1, 7),
    scale: new Vector3(6, 3, 0.05)
  })
)
wall5.addComponent(new BoxShape())
engine.addEntity(wall5)

const entryButton = new Entity()
entryButton.addComponent(
  new Transform({
    position: new Vector3(3.6, 1.6, 2.98),
    scale: new Vector3(0.2, 0.2, 0.05)
  })
)
entryButton.addComponent(new BoxShape())
engine.addEntity(entryButton)


// Define a material to color the button black
const buttonMaterial = new Material()
doorMaterial.albedoColor = Color3.Black()
doorMaterial.metallic = 0.9
doorMaterial.roughness = 0.1

// Assign the material to the button
entryButton.addComponent(buttonMaterial)
exitButton.addComponent(buttonMaterial)


entryButton.addComponent(
  new OnPointerDown(async (e) => {
    let nftOwned = await doesUserHaveNFT();
    if(nftOwned){
      movePlayerTo({ x: 5, y: 0, z: 5 }, { x: 8, y: 1, z: 8 })
      engine.removeEntity(entryButton);
      engine.removeEntity(entrySign);
      engine.addEntity(exitButton)
      engine.addEntity(portrait1)
      engine.addEntity(coolKatana)
    }
  }, 
  {
    button: ActionButton.PRIMARY,
      showFeedback: true,
      hoverText: "open",
  })
)

exitButton.addComponent(
  new Transform({
    position: new Vector3(3.6, 1.6, 3.03),
    scale: new Vector3(0.2, 0.2, 0.05)
  })
)
exitButton.addComponent(new BoxShape())
engine.addEntity(exitButton)



exitButton.addComponent(
  new OnPointerDown(async (e) => {
      movePlayerTo({ x: 1, y: 0, z: 1 }, { x: 8, y: 1, z: 8 })
      engine.addEntity(entryButton);
      engine.addEntity(entrySign);
      engine.removeEntity(exitButton)
      engine.removeEntity(portrait1)
      engine.removeEntity(coolKatana)
  }, 
  {
    button: ActionButton.PRIMARY,
      showFeedback: true,
      hoverText: "open",
  })
)



// engine.addEntity(respawner)
log(nftOwned)
async function doesUserHaveNFT() {
  const userData = await getUserData()

  for (const wearable of userData!.avatar.wearables) {
    if (wearable === "urn:decentraland:off-chain:base-avatars:cyclope") {
      log("user has nft")
      log(wearable)
      return true
    }
    log(wearable + "is not the nft")
  }
  log("user doesn't have nft")
return false
}



//attempt to kick people who try to glitch into the museum. Failed miserably
// while(getPlayersInScene.length > 0) {
//   log("players are in the scene")

//   if(Camera.instance.feetPosition.z > 3 && !nftOwned) {
//     log("player should be moved")
//     movePlayerTo({ x: 1, y: 0, z: 1 }, { x: 8, y: 1, z: 8 })
//   }
// }