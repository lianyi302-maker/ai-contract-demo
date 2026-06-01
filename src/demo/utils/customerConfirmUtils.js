import {
  CUSTOMER_STATUS,
  CUSTOMER_TYPE,
  CUSTOMER_SOURCE,
} from '../../data/demoFlowState';

export const CUSTOMER_SOURCE_LABEL = {
  [CUSTOMER_SOURCE.ID_CARD]: '身份证识别',
  [CUSTOMER_SOURCE.CONTRACT]: '合同识别',
  [CUSTOMER_SOURCE.BUSINESS_LICENSE]: '营业执照识别',
};

export const CUSTOMER_TYPE_LABEL = {
  [CUSTOMER_TYPE.PERSONAL]: '个人客户',
  [CUSTOMER_TYPE.ENTERPRISE]: '企业客户',
};

export const CUSTOMER_STATUS_LABEL = {
  [CUSTOMER_STATUS.PENDING]: '待确认',
  [CUSTOMER_STATUS.MISSING]: '信息缺失',
  [CUSTOMER_STATUS.READY]: '可创建',
  [CUSTOMER_STATUS.CREATED]: '已创建',
  [CUSTOMER_STATUS.UPDATED]: '已更新',
};

export function isPersonalCustomer(customer) {
  return customer?.customerType === CUSTOMER_TYPE.PERSONAL;
}

export function hasAccountContact(customer) {
  const { mobilePhone, email } = customer.account || {};
  return Boolean(mobilePhone?.trim() || email?.trim());
}

export function isIdModuleComplete(customer) {
  const id = customer.idDocument || {};
  if (customer.customerType === CUSTOMER_TYPE.ENTERPRISE) {
    return Boolean(id.idNumber?.trim() && id.frontPhoto?.uploaded);
  }
  const base =
    id.idType &&
    id.idNumber?.trim() &&
    id.validUntil?.trim() &&
    id.idAddress?.trim() &&
    id.frontPhoto?.uploaded;
  if (customer.source === CUSTOMER_SOURCE.ID_CARD) {
    return base && id.backPhoto?.uploaded;
  }
  return base;
}

export function isAddressModuleComplete(customer) {
  const addr = customer.address || {};
  return Boolean(
    addr.province?.trim() &&
      addr.city?.trim() &&
      addr.district?.trim() &&
      addr.detailAddress?.trim() &&
      addr.zipCode?.trim() &&
      addr.addressType?.trim() &&
      addr.mailMethod?.trim() &&
      (!addr.autoFilledFromId || addr.confirmed)
  );
}

export function isCustomerRequiredFieldsFilled(customer) {
  if (!customer) return false;
  const { account, personal, idDocument, address } = customer;
  if (!account?.mobilePhone?.trim() && !account?.email?.trim()) return false;

  if (customer.customerType === CUSTOMER_TYPE.ENTERPRISE) {
    return Boolean(personal?.chineseName?.trim() && idDocument?.idNumber?.trim());
  }

  const p = personal || {};
  const id = idDocument || {};
  const addr = address || {};
  return Boolean(
    p.chineseName?.trim() &&
      p.gender?.trim() &&
      p.nationality?.trim() &&
      id.idType?.trim() &&
      id.idNumber?.trim() &&
      id.validUntil?.trim() &&
      id.idStatus?.trim() &&
      addr.province?.trim() &&
      addr.city?.trim() &&
      addr.district?.trim() &&
      addr.detailAddress?.trim() &&
      addr.zipCode?.trim() &&
      addr.addressType?.trim() &&
      addr.mailMethod?.trim()
  );
}

export function isPersonalFormComplete(customer) {
  if (!isPersonalCustomer(customer)) {
    return hasAccountContact(customer) && isIdModuleComplete(customer) && isAddressModuleComplete(customer);
  }
  const p = customer.personal || {};
  return (
    hasAccountContact(customer) &&
    p.chineseName?.trim() &&
    p.gender?.trim() &&
    p.nationality?.trim() &&
    isIdModuleComplete(customer) &&
    isAddressModuleComplete(customer)
  );
}

export function computeCustomerStats(customers) {
  const total = customers.length;
  const pending = customers.filter((c) =>
    [CUSTOMER_STATUS.PENDING, CUSTOMER_STATUS.MISSING, CUSTOMER_STATUS.READY].includes(c.status)
  ).length;
  const missing = customers.filter((c) => c.status === CUSTOMER_STATUS.MISSING).length;
  const done = customers.filter((c) =>
    [CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(c.status)
  ).length;
  const created = customers.filter((c) => c.status === CUSTOMER_STATUS.CREATED).length;
  const updated = customers.filter((c) => c.status === CUSTOMER_STATUS.UPDATED).length;
  return { total, pending, missing, done, created, updated };
}

export function deriveCustomerStatus(customer) {
  if ([CUSTOMER_STATUS.CREATED, CUSTOMER_STATUS.UPDATED].includes(customer.status)) {
    return customer.status;
  }
  if (
    customer.source === CUSTOMER_SOURCE.ID_CARD &&
    customer.idDocument?.frontPhoto?.uploaded &&
    !customer.idDocument?.backPhoto?.uploaded
  ) {
    return CUSTOMER_STATUS.MISSING;
  }
  if (isPersonalFormComplete(customer)) {
    return CUSTOMER_STATUS.READY;
  }
  if (customer.status === CUSTOMER_STATUS.MISSING) {
    return CUSTOMER_STATUS.MISSING;
  }
  return CUSTOMER_STATUS.PENDING;
}
