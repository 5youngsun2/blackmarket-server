module.exports = function (sequelize, dataTypes) {
  //테이블명, 입력데이터
  const banner = sequelize.define("Banner", {
    imageUrl: {
      type: dataTypes.STRING(300),
      allowNull: false,
    },
    href: {
      type: dataTypes.STRING(300),
      allowNull: false,
    },
  });
  return banner;
};
