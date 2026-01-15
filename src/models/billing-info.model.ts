import { IBillingInfo } from "../interfaces/billing-info.interface";

export class BillingInfo implements IBillingInfo {
  private _firstName: string;
  private _lassName: string;
  private _companyName?: string;
  private _countryOrRegion: string;
  private _streetAddress: string;
  private _streetAddressExtra?: string;
  private _townOrCity: string;
  private _state: string;
  private _zipCode: string;
  private _phone: string;
  private _email: string;

  get firstName() {
    return this._firstName;
  }

  set firstName(val: string) {
    this._firstName = val;
  }

  get lassName() {
    return this._lassName;
  }

  set lassName(val: string) {
    this._lassName = val;
  }

  get companyName(): string | undefined {
    return this._companyName;
  }

  set companyName(val: string) {
    this._companyName = val;
  }

  get countryOrRegion() {
    return this._countryOrRegion;
  }

  set countryOrRegion(val: string) {
    this._countryOrRegion = val;
  }

  get streetAddress() {
    return this._streetAddress;
  }

  set streetAddress(val: string) {
    this._streetAddress = val;
  }

  get streetAddressExtra(): string | undefined {
    return this._streetAddressExtra;
  }

  set streetAddressExtra(val: string) {
    this._streetAddressExtra = val;
  }

  get townOrCity() {
    return this._townOrCity;
  }

  set townOrCity(val: string) {
    this._townOrCity = val;
  }

  get state() {
    return this._state;
  }

  set state(val: string) {
    this._state = val;
  }

  get zipCode() {
    return this._zipCode;
  }

  set zipCode(val: string) {
    this._zipCode = val;
  }

  get phone() {
    return this._phone;
  }

  set phone(val: string) {
    this._phone = val;
  }

  get email() {
    return this._email;
  }

  set email(val: string) {
    this._email = val;
  }

  constructor(object: IBillingInfo) {
    this._firstName = object.firstName;
    this._lassName = object.lassName;
    this._countryOrRegion = object.countryOrRegion;
    this._streetAddress = object.streetAddress;
    this._townOrCity = object.townOrCity;
    this._state = object.state;
    this._zipCode = object.zipCode;
    this._phone = object.phone;
    this._email = object.email;
  }
}
