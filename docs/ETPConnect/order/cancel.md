[/docs/ETPConnect](/docs/ETPConnect)

# Cancel order

## Note : 
* getCancelReason : Nếu lý do hủy = khác -> lấy lý do hủy mở rộng, ngược lại lấy lý do hủy
* [UUID] : chuỗi kí tự random, ví dụ : ac7037c8-43be-4f51-8573-33618954b369
* [BLANK] : mảng rỗng : []

## Mapping

```js
{
  ActionInfo: {
    ActionId: { DataType: 'String', Mandatory: 'M', DataWith: 10, HardCode: 'ORDCNCL_R' },
  },
  OmniChannelOrder: {
    SourceOrderNumber: { DataType: 'String', Mandatory: 'M', DataWith: 20, HrField: 'order_number' },
    OrderSourceID: { DataType: 'String', Mandatory: 'M', DataWith: 10, HardCode: 'ST999' },
    OrderSourceName: { DataType: 'String', Mandatory: 'M', DataWith: 20, HardCode: 'ECOM' },
    OrderDate: { DataType: 'Date', DateFormat: 'YYYYMMDD', Mandatory: 'M', DataWith: 8, HrField: 'created_at' },
    StoreCode: { DataType: 'String', Mandatory: 'M', DataWith: 5, HrField: 'pos_code_location' },
    OrderStatusRequest: { DataType: 'String', Mandatory: 'M', DataWith: 10, HardCode: '14' },
    CancelReason: { DataType: 'String', Mandatory: 'M', DataWith: 100, HardCode: '14', GetValue: getCancelReason },
  },
  RequestInfo: {
    RequestKey: { DataType: 'String', Mandatory: 'M', DataWith: 100, HardCode: '[UUID]' },
  },
  Response: {
    RespMsg: { DataType: 'String', Mandatory: 'M', DataWith: 100, HardCode: '[BLANK]' },
    RespCode: { DataType: 'String', Mandatory: 'M', DataWith: 8, HardCode: '[BLANK]' },
  }
}
```
