// import {useEffect} from "react";
// import SimpleCrypto from "simple-crypto-js";
// import {getFromSessionStore} from "../index.ts";
// import {mainController} from "../../view/d/main/MainController.js";
//
// export default function useCheckHash() {
// 	useEffect(() => {
// 		let lastHash = '',
// 			secret = import.meta.env.VITE_REACT_APP_ENCRYPT_KEY,
// 			sC = new SimpleCrypto(secret),
// 			encryptPanels = getFromSessionStore('panels'),
// 			panels = encryptPanels ? sC.decrypt(encryptPanels) : '',
// 			handleHashChange = () => {
// 				let {hash} = window.location,
// 					reference = hash.split('#')[1];
// 				if(encryptPanels && !panels.includes(reference)) {
// 					mainController.setView(lastHash)
// 				}
// 				lastHash = reference
// 			};
// 		window.addEventListener('hashchange', handleHashChange);
// 		return () => {window.removeEventListener('hashchange', handleHashChange)};
// 	}, [])
// }