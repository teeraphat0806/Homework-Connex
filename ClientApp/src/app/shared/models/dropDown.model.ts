export class DropDownViewModel {
  key: string = ''; // มีสองกรณี กรณี key เป็น code กับ กรณี key เป็น string
  value: string = '';
}

export interface TierModel {
  tierId: number;
  tierName: string;
  tierRank: number;
}

export interface DropdownTierViewModel {
  tierList: TierModel[];
}

export interface RefPlatformOption {
  platformCode: string;
  platformName: string;
  backgroundColorCode: string;
  textColorCode: string;
  iconCode: string;
}
