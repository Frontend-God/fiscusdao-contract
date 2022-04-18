/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Governable, GovernableInterface } from "../Governable";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousGovernor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newGovernor",
        type: "address",
      },
    ],
    name: "GovernorPulled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousGovernor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newGovernor",
        type: "address",
      },
    ],
    name: "GovernorPushed",
    type: "event",
  },
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

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b03191633178082556040516001600160a01b039190911691907fffd6fed33fe8ec1016718bdd5d04ae6fecd9aba0da6578807daaaa7fc3d16826908290a361032e806100696000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630c340a24146100515780631f5f2ccc14610075578063d8a042121461009d578063e026049c146100a5575b600080fd5b6100596100ad565b604080516001600160a01b039092168252519081900360200190f35b61009b6004803603602081101561008b57600080fd5b50356001600160a01b03166100bc565b005b61009b61016d565b61009b610227565b6000546001600160a01b031690565b6000546001600160a01b031633146101055760405162461bcd60e51b81526004018080602001828103825260268152602001806102d46026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f4fbd6e04620907a96d194bfd18fc026ef2836202d9265ffe2d9d9a944a9d907491a36001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6001546001600160a01b031633146101b65760405162461bcd60e51b81526004018080602001828103825260288152602001806102fa6028913960400191505060405180910390fd5b600154600080546040516001600160a01b0393841693909116917fffd6fed33fe8ec1016718bdd5d04ae6fecd9aba0da6578807daaaa7fc3d1682691a3600180546000805473ffffffffffffffffffffffffffffffffffffffff199081166001600160a01b03841617909155169055565b6000546001600160a01b031633146102705760405162461bcd60e51b81526004018080602001828103825260268152602001806102d46026913960400191505060405180910390fd5b600080546040516001600160a01b03909116907fffd6fed33fe8ec1016718bdd5d04ae6fecd9aba0da6578807daaaa7fc3d16826908390a36000805473ffffffffffffffffffffffffffffffffffffffff1990811690915560018054909116905556fe476f7665726e61626c653a2063616c6c6572206973206e6f742074686520676f7665726e6f72476f7665726e61626c653a206d757374206265206e657720676f7665726e6f7220746f2070756c6ca164736f6c6343000705000a";

export class Governable__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Governable> {
    return super.deploy(overrides || {}) as Promise<Governable>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Governable {
    return super.attach(address) as Governable;
  }
  connect(signer: Signer): Governable__factory {
    return super.connect(signer) as Governable__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovernableInterface {
    return new utils.Interface(_abi) as GovernableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Governable {
    return new Contract(address, _abi, signerOrProvider) as Governable;
  }
}
