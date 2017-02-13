import { CreateQuoteComponent, DialogSelectCustomer, DialogSelectProductLine } from './create-quote.component';



export const CREATEQUOTE_ENTRYCOMPONENTS = [
  DialogSelectCustomer,
  DialogSelectProductLine
]

export const CREATEQUOTE_DECLARATIONS = [
  CreateQuoteComponent,
  ...CREATEQUOTE_ENTRYCOMPONENTS
]
