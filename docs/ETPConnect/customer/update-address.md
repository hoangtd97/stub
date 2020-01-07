[/docs/ETPConnect](/docs/ETPConnect)

# Update customer address


## Note
* getProvinceCode : xem bảng map địa chỉ
* Chỉ đồng bộ khi một trong các trường sau được cập nhật :
  * default_address
  * id
  * email
  * addresses

## Mapping

```js
{
  ActionInfo: {
    ActionId: { DataType: 'String', Mandatory: 'M', DataWith: 10, HardCode: 'CUSTADDUPD_R' },
  },
  CompanyInfo: {
    Comapny: { DataType: 'Numeric', Mandatory: 'M', DataWith: 3, HardCode: '999' },
    Division: { DataType: 'Numeric', Mandatory: 'M', DataWith: 3, HardCode: '888' },
    WareHouse: { DataType: 'String', Mandatory: 'M', DataWith: 5, HardCode: 'ECOM' },
    EComName: { DataType: 'String', Mandatory: 'M', DataWith: 50, HardCode: 'CO3' },
    ChannelID: { DataType: 'String', Mandatory: 'M', DataWith: 5, HardCode: 'ECOMMERCE' },
  },
  CustDetails: {
    CustomerInfo: {
      CustomerRefID: { DataType: 'String', Mandatory: 'M', DataWith: 30, HrField: 'id' },
      CustEmailID: { DataType: 'String', Mandatory: 'M', DataWith: 50, HrField: 'email' },
      CustAltEmailID: { DataType: 'String', Mandatory: 'M', DataWith: 50, HardCode: '[BLANK]' },
      CustUserType: { DataType: 'String', Mandatory: 'M', DataWith: 5, HardCode: 'C' },
      CustUserLoginID: { DataType: 'String', Mandatory: 'M', DataWith: 30, HrField: 'email', Description: 'email or blank' },
      CustAddrDetails: {
        CustAddrInfo: { DataType: 'Array', maxItems: 3, HrField: 'addresses', items: {
          CustAddrDataType: { DataType: 'String', Mandatory: 'M', DataWith: 5, HardCode: 'LOCAL' },
          CustAddrCode: { DataType: 'String', Mandatory: 'M', DataWith: 15, HrField: 'addresses[i].id' },
          CustAddrLine1: { DataType: 'String', Mandatory: 'M', DataWith: 200, HrField: 'addresses[i].address1' },
          CustAddrLine2: { DataType: 'String', Mandatory: 'M', DataWith: 200, HrField: 'addresses[i].ward' },
          CustAddrLine3: { DataType: 'String', Mandatory: 'M', DataWith: 200, HrField: 'addresses[i].phone' },
          CustAddrLandmark: { DataType: 'String', Mandatory: 'O', DataWith: 100, HardCode: '[BLANK]' },
          CustAddrDist: { DataType: 'String', Mandatory: 'M', DataWith: 25, HrField: 'addresses[i].district' },
          CustAddrCity: { DataType: 'String', Mandatory: 'M', DataWith: 25, GetValue: getProvinceCode },
          CustAddrState: { DataType: 'String', Mandatory: 'M', DataWith: 25, HardCode: 'Vietnam' },
          CustAddrZip: { DataType: 'String', Mandatory: 'M', DataWith: 20, HrField: 'addresses[i].zip' },
          CustAddrCountry: { DataType: 'String', Mandatory: 'M', DataWith: 25, HrField: 'addresses[i].country_code', HardCode: 'Vietnam' },
        }},
      },
      LoyaltyRewardDetails: {
        LoyaltyRewardInfo: {
          LoyaltyScheme: { DataType: 'String', Mandatory: 'O', DataWith: 50, HardCode: '[BLANK]' },
          LoyaltySchemeInfoDesc: { DataType: 'String', Mandatory: 'O', DataWith: 100, HardCode: '[BLANK]' },
          EarnedTransactions: { DataType: 'String', Mandatory: 'O', DataWith: 20, HardCode: '[BLANK]' },
          Rewards: { DataType: 'String', Mandatory: 'O', DataWith: 30, HardCode: '[BLANK]' },
        }
      }
    }
  },
  RequestInfo: {
    RequestKey: { DataType: 'String', Mandatory: 'M', DataWith: 100, HardCode: '[UUID]' },
  },
  Response: {
    RespMsg: { DataType: 'String', Mandatory: 'M', DataWith: 100, HardCode: [] },
    RespCode: { DataType: 'String', Mandatory: 'M', DataWith: 8, HardCode: [] },
  }
}
```