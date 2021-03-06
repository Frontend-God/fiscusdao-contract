/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IGovernable, IGovernableInterface } from "../IGovernable";

const _abi = [
  {
    inputs: [],
    name: "governor",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pullGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newGovernor_",
        type: "address",
      },
    ],
    name: "pushGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IGovernable__factory {
  static readonly abi = _abi;
  static createInterface(): IGovernableInterface {
    return new utils.Interface(_abi) as IGovernableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGovernable {
    return new Contract(address, _abi, signerOrProvider) as IGovernable;
  }
}
