const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class AwsEc2Instances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  AwsEc2Instances.init({
    time: DataTypes.DATE,
    instanceId: DataTypes.STRING,
    instanceType: DataTypes.STRING,
    region: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AwsEc2Instances'
  })
  return AwsEc2Instances
}
