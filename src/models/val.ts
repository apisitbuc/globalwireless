import _ from "lodash";

class Val {
  valueNumber: number;
  constructor(json: any) {
    this.valueNumber = _.get(json, "valueNumber");
  }
}

export default Val;
