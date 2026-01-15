import { PaymentMethod } from "../constants/payment-method.constants";
import { IBillingInfo } from "./billing-info.interface";

export interface IOrderInfo {
  billingInfo: IBillingInfo;
  paymentMethod: PaymentMethod;
  createAccount?: boolean;
  orderNotes?: string;
}
