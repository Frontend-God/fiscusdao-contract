/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface FiscusTokenMigratorInterface extends ethers.utils.Interface {
  functions: {
    "authority()": FunctionFragment;
    "bridgeBack(uint256,uint8)": FunctionFragment;
    "defund(address)": FunctionFragment;
    "gFISC()": FunctionFragment;
    "halt()": FunctionFragment;
    "migrate(uint256,uint8,uint8)": FunctionFragment;
    "migrateAll(uint8)": FunctionFragment;
    "migrateContracts(address,address,address,address,address)": FunctionFragment;
    "migrateLP(address,bool,address,uint256,uint256)": FunctionFragment;
    "migrateToken(address)": FunctionFragment;
    "newFISC()": FunctionFragment;
    "newStaking()": FunctionFragment;
    "newTreasury()": FunctionFragment;
    "ohmMigrated()": FunctionFragment;
    "oldFISC()": FunctionFragment;
    "oldStaking()": FunctionFragment;
    "oldSupply()": FunctionFragment;
    "oldTreasury()": FunctionFragment;
    "oldsFISC()": FunctionFragment;
    "oldwsFISC()": FunctionFragment;
    "setAuthority(address)": FunctionFragment;
    "setgFISC(address)": FunctionFragment;
    "shutdown()": FunctionFragment;
    "startTimelock()": FunctionFragment;
    "sushiRouter()": FunctionFragment;
    "timelockEnd()": FunctionFragment;
    "timelockLength()": FunctionFragment;
    "uniRouter()": FunctionFragment;
    "withdrawToken(address,uint256,address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "authority", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "bridgeBack",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "defund", values: [string]): string;
  encodeFunctionData(functionFragment: "gFISC", values?: undefined): string;
  encodeFunctionData(functionFragment: "halt", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "migrate",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateAll",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateContracts",
    values: [string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateLP",
    values: [string, boolean, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateToken",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "newFISC", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "newStaking",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "newTreasury",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ohmMigrated",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "oldFISC", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "oldStaking",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "oldSupply", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "oldTreasury",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "oldsFISC", values?: undefined): string;
  encodeFunctionData(functionFragment: "oldwsFISC", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setAuthority",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setgFISC", values: [string]): string;
  encodeFunctionData(functionFragment: "shutdown", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "startTimelock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sushiRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "timelockEnd",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "timelockLength",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "uniRouter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawToken",
    values: [string, BigNumberish, string]
  ): string;

  decodeFunctionResult(functionFragment: "authority", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bridgeBack", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "defund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gFISC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "halt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "migrate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "migrateAll", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "migrateContracts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "migrateLP", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "migrateToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "newFISC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "newStaking", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "newTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ohmMigrated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oldFISC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oldStaking", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oldSupply", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "oldTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oldsFISC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oldwsFISC", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAuthority",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setgFISC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "shutdown", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "startTimelock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sushiRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timelockEnd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timelockLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "uniRouter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;

  events: {
    "AuthorityUpdated(address)": EventFragment;
    "Defunded(uint256)": EventFragment;
    "Funded(uint256)": EventFragment;
    "Migrated(address,address)": EventFragment;
    "TimelockStarted(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AuthorityUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Defunded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Funded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Migrated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TimelockStarted"): EventFragment;
}

export type AuthorityUpdatedEvent = TypedEvent<
  [string] & { authority: string }
>;

export type DefundedEvent = TypedEvent<[BigNumber] & { amount: BigNumber }>;

export type FundedEvent = TypedEvent<[BigNumber] & { amount: BigNumber }>;

export type MigratedEvent = TypedEvent<
  [string, string] & { staking: string; treasury: string }
>;

export type TimelockStartedEvent = TypedEvent<
  [BigNumber, BigNumber] & { block: BigNumber; end: BigNumber }
>;

export class FiscusTokenMigrator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: FiscusTokenMigratorInterface;

  functions: {
    authority(overrides?: CallOverrides): Promise<[string]>;

    bridgeBack(
      _amount: BigNumberish,
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    defund(
      reserve: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    gFISC(overrides?: CallOverrides): Promise<[string]>;

    halt(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrate(
      _amount: BigNumberish,
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrateAll(
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrateContracts(
      _newTreasury: string,
      _newStaking: string,
      _newFISC: string,
      _newsFISC: string,
      _reserve: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrateLP(
      pair: string,
      sushi: boolean,
      token: string,
      _minA: BigNumberish,
      _minB: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    migrateToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    newFISC(overrides?: CallOverrides): Promise<[string]>;

    newStaking(overrides?: CallOverrides): Promise<[string]>;

    newTreasury(overrides?: CallOverrides): Promise<[string]>;

    ohmMigrated(overrides?: CallOverrides): Promise<[boolean]>;

    oldFISC(overrides?: CallOverrides): Promise<[string]>;

    oldStaking(overrides?: CallOverrides): Promise<[string]>;

    oldSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    oldTreasury(overrides?: CallOverrides): Promise<[string]>;

    oldsFISC(overrides?: CallOverrides): Promise<[string]>;

    oldwsFISC(overrides?: CallOverrides): Promise<[string]>;

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setgFISC(
      _gFISC: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    shutdown(overrides?: CallOverrides): Promise<[boolean]>;

    startTimelock(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sushiRouter(overrides?: CallOverrides): Promise<[string]>;

    timelockEnd(overrides?: CallOverrides): Promise<[BigNumber]>;

    timelockLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    uniRouter(overrides?: CallOverrides): Promise<[string]>;

    withdrawToken(
      tokenAddress: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  authority(overrides?: CallOverrides): Promise<string>;

  bridgeBack(
    _amount: BigNumberish,
    _to: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  defund(
    reserve: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  gFISC(overrides?: CallOverrides): Promise<string>;

  halt(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrate(
    _amount: BigNumberish,
    _from: BigNumberish,
    _to: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrateAll(
    _to: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrateContracts(
    _newTreasury: string,
    _newStaking: string,
    _newFISC: string,
    _newsFISC: string,
    _reserve: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrateLP(
    pair: string,
    sushi: boolean,
    token: string,
    _minA: BigNumberish,
    _minB: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  migrateToken(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  newFISC(overrides?: CallOverrides): Promise<string>;

  newStaking(overrides?: CallOverrides): Promise<string>;

  newTreasury(overrides?: CallOverrides): Promise<string>;

  ohmMigrated(overrides?: CallOverrides): Promise<boolean>;

  oldFISC(overrides?: CallOverrides): Promise<string>;

  oldStaking(overrides?: CallOverrides): Promise<string>;

  oldSupply(overrides?: CallOverrides): Promise<BigNumber>;

  oldTreasury(overrides?: CallOverrides): Promise<string>;

  oldsFISC(overrides?: CallOverrides): Promise<string>;

  oldwsFISC(overrides?: CallOverrides): Promise<string>;

  setAuthority(
    _newAuthority: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setgFISC(
    _gFISC: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  shutdown(overrides?: CallOverrides): Promise<boolean>;

  startTimelock(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sushiRouter(overrides?: CallOverrides): Promise<string>;

  timelockEnd(overrides?: CallOverrides): Promise<BigNumber>;

  timelockLength(overrides?: CallOverrides): Promise<BigNumber>;

  uniRouter(overrides?: CallOverrides): Promise<string>;

  withdrawToken(
    tokenAddress: string,
    amount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    authority(overrides?: CallOverrides): Promise<string>;

    bridgeBack(
      _amount: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    defund(reserve: string, overrides?: CallOverrides): Promise<void>;

    gFISC(overrides?: CallOverrides): Promise<string>;

    halt(overrides?: CallOverrides): Promise<void>;

    migrate(
      _amount: BigNumberish,
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    migrateAll(_to: BigNumberish, overrides?: CallOverrides): Promise<void>;

    migrateContracts(
      _newTreasury: string,
      _newStaking: string,
      _newFISC: string,
      _newsFISC: string,
      _reserve: string,
      overrides?: CallOverrides
    ): Promise<void>;

    migrateLP(
      pair: string,
      sushi: boolean,
      token: string,
      _minA: BigNumberish,
      _minB: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    migrateToken(token: string, overrides?: CallOverrides): Promise<void>;

    newFISC(overrides?: CallOverrides): Promise<string>;

    newStaking(overrides?: CallOverrides): Promise<string>;

    newTreasury(overrides?: CallOverrides): Promise<string>;

    ohmMigrated(overrides?: CallOverrides): Promise<boolean>;

    oldFISC(overrides?: CallOverrides): Promise<string>;

    oldStaking(overrides?: CallOverrides): Promise<string>;

    oldSupply(overrides?: CallOverrides): Promise<BigNumber>;

    oldTreasury(overrides?: CallOverrides): Promise<string>;

    oldsFISC(overrides?: CallOverrides): Promise<string>;

    oldwsFISC(overrides?: CallOverrides): Promise<string>;

    setAuthority(
      _newAuthority: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setgFISC(_gFISC: string, overrides?: CallOverrides): Promise<void>;

    shutdown(overrides?: CallOverrides): Promise<boolean>;

    startTimelock(overrides?: CallOverrides): Promise<void>;

    sushiRouter(overrides?: CallOverrides): Promise<string>;

    timelockEnd(overrides?: CallOverrides): Promise<BigNumber>;

    timelockLength(overrides?: CallOverrides): Promise<BigNumber>;

    uniRouter(overrides?: CallOverrides): Promise<string>;

    withdrawToken(
      tokenAddress: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AuthorityUpdated(address)"(
      authority?: string | null
    ): TypedEventFilter<[string], { authority: string }>;

    AuthorityUpdated(
      authority?: string | null
    ): TypedEventFilter<[string], { authority: string }>;

    "Defunded(uint256)"(
      amount?: null
    ): TypedEventFilter<[BigNumber], { amount: BigNumber }>;

    Defunded(
      amount?: null
    ): TypedEventFilter<[BigNumber], { amount: BigNumber }>;

    "Funded(uint256)"(
      amount?: null
    ): TypedEventFilter<[BigNumber], { amount: BigNumber }>;

    Funded(amount?: null): TypedEventFilter<[BigNumber], { amount: BigNumber }>;

    "Migrated(address,address)"(
      staking?: null,
      treasury?: null
    ): TypedEventFilter<
      [string, string],
      { staking: string; treasury: string }
    >;

    Migrated(
      staking?: null,
      treasury?: null
    ): TypedEventFilter<
      [string, string],
      { staking: string; treasury: string }
    >;

    "TimelockStarted(uint256,uint256)"(
      block?: null,
      end?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { block: BigNumber; end: BigNumber }
    >;

    TimelockStarted(
      block?: null,
      end?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { block: BigNumber; end: BigNumber }
    >;
  };

  estimateGas: {
    authority(overrides?: CallOverrides): Promise<BigNumber>;

    bridgeBack(
      _amount: BigNumberish,
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    defund(
      reserve: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    gFISC(overrides?: CallOverrides): Promise<BigNumber>;

    halt(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrate(
      _amount: BigNumberish,
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrateAll(
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrateContracts(
      _newTreasury: string,
      _newStaking: string,
      _newFISC: string,
      _newsFISC: string,
      _reserve: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrateLP(
      pair: string,
      sushi: boolean,
      token: string,
      _minA: BigNumberish,
      _minB: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    migrateToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    newFISC(overrides?: CallOverrides): Promise<BigNumber>;

    newStaking(overrides?: CallOverrides): Promise<BigNumber>;

    newTreasury(overrides?: CallOverrides): Promise<BigNumber>;

    ohmMigrated(overrides?: CallOverrides): Promise<BigNumber>;

    oldFISC(overrides?: CallOverrides): Promise<BigNumber>;

    oldStaking(overrides?: CallOverrides): Promise<BigNumber>;

    oldSupply(overrides?: CallOverrides): Promise<BigNumber>;

    oldTreasury(overrides?: CallOverrides): Promise<BigNumber>;

    oldsFISC(overrides?: CallOverrides): Promise<BigNumber>;

    oldwsFISC(overrides?: CallOverrides): Promise<BigNumber>;

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setgFISC(
      _gFISC: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    shutdown(overrides?: CallOverrides): Promise<BigNumber>;

    startTimelock(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sushiRouter(overrides?: CallOverrides): Promise<BigNumber>;

    timelockEnd(overrides?: CallOverrides): Promise<BigNumber>;

    timelockLength(overrides?: CallOverrides): Promise<BigNumber>;

    uniRouter(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawToken(
      tokenAddress: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    authority(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridgeBack(
      _amount: BigNumberish,
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    defund(
      reserve: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    gFISC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    halt(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrate(
      _amount: BigNumberish,
      _from: BigNumberish,
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrateAll(
      _to: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrateContracts(
      _newTreasury: string,
      _newStaking: string,
      _newFISC: string,
      _newsFISC: string,
      _reserve: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrateLP(
      pair: string,
      sushi: boolean,
      token: string,
      _minA: BigNumberish,
      _minB: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    migrateToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    newFISC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    newStaking(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    newTreasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ohmMigrated(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oldFISC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oldStaking(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oldSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oldTreasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oldsFISC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oldwsFISC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setgFISC(
      _gFISC: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    shutdown(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    startTimelock(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sushiRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    timelockEnd(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    timelockLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    uniRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawToken(
      tokenAddress: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
