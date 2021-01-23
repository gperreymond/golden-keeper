[![Moleculer logo](./banner-moleculer.png)](https://moleculer.services/)

# golden-keeper
Monitoring and analysing cloud provider pricing

![workflow moleculer](https://github.com/gperreymond/golden-keeper/workflows/Moleculer/badge.svg?branch=main) [![codecov](https://codecov.io/gh/gperreymond/golden-keeper/branch/main/graph/badge.svg?token=T2JBQ2FL35)](https://codecov.io/gh/gperreymond/golden-keeper)

```js
r.db("golden_keeper")
  .table("aws_ec2_instances_pricing")
  .filter({ labels: { instanceType: "m5.4xlarge" } })

r.db("golden_keeper")
  .table("aws_ec2_instances_details")
  .filter({ labels: { instanceId: "i-040489825c19493d8" } })

r.db("golden_keeper")
  .table("aws_ec2_instances_details")
  .innerJoin(r.db("golden_keeper").table("aws_ec2_instances_pricing"), function(instanceRow, pricingRow) {
    return instanceRow("labels")("instanceType").match(pricingRow("labels")("instanceType"))
  })
  .merge(item => {
    return item("left").merge(item("right").without("time", "id"))
  })
  .without("left", "right", "id")
  .merge(item => {
    return item("labels")
	}).without("labels")
  .merge(item => {
    return item.merge({ upTime: item("time").sub(item("launchTime")) })
  })
  .merge(item => {
    return item.merge({ priceUSD: item("price")("USD").coerceTo("number") })
  }).without("price")
  .filter({ state: "running" })
```
