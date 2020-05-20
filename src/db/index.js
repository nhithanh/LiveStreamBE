import { Sequelize } from 'sequelize';

import * as fromModels from '../models';

const Op = Sequelize.Op;

const operatorsAliases = {
   $eq: Op.eq,
   $ne: Op.ne,
   $gte: Op.gte,
   $gt: Op.gt,
   $lte: Op.lte,
   $lt: Op.lt,
   $not: Op.not,
   $in: Op.in,
   $notIn: Op.notIn,
   $is: Op.is,
   $like: Op.like,
   $notLike: Op.notLike,
   $iLike: Op.iLike,
   $notILike: Op.notILike,
   $regexp: Op.regexp,
   $notRegexp: Op.notRegexp,
   $iRegexp: Op.iRegexp,
   $notIRegexp: Op.notIRegexp,
   $between: Op.between,
   $notBetween: Op.notBetween,
   $overlap: Op.overlap,
   $contains: Op.contains,
   $contained: Op.contained,
   $adjacent: Op.adjacent,
   $strictLeft: Op.strictLeft,
   $strictRight: Op.strictRight,
   $noExtendRight: Op.noExtendRight,
   $noExtendLeft: Op.noExtendLeft,
   $and: Op.and,
   $or: Op.or,
   $any: Op.any,
   $all: Op.all,
   $values: Op.values,
   $col: Op.col
};

const sequelize = new Sequelize('postgres://postgres:nhatthanh123@localhost:5432/live_stream', { operatorsAliases });

const models = {
   User: fromModels.initUserModel(sequelize),

   UserProfile: fromModels.initUserProfileModel(sequelize),
   LiveStream: fromModels.initLiveStreamModel(sequelize),
   UserFavoriteBroadcaster: fromModels.initUserFavoriteStreamerModel(sequelize),
   Category: fromModels.initCategoryModel(sequelize),
   Chat: fromModels.initChatModel(sequelize),
   ViewerLiveStream: fromModels.initViewerLiveStreamModel(sequelize),
   Wallet: fromModels.initWalletModel(sequelize),
   WalletTransaction: fromModels.initWalletTransactionModel(sequelize),
   Report: fromModels.initReportModel(sequelize)
};

// User
models.User.hasMany(models.Chat, {
   foreignKey: "userId"
});

models.User.hasOne(models.UserProfile, { foreignKey: 'userId' });
models.User.hasOne(models.Wallet, { foreignKey: "userId" });

models.User.hasMany(models.LiveStream, {
   foreignKey: "streamerId"
});

models.User.belongsToMany(models.User, {
   through: "UserFavoriteStreamer",
   as: "favoriteStreamer",
   foreignKey: "userId"
});

models.User.belongsToMany(models.User, {
   through: "UserFavoriteStreamer",
   as: "follower",
   foreignKey: "streamerId"
});

// Live stream

models.LiveStream.belongsTo(models.User, { as: "streamer", foreignKey: "streamerId" });

models.LiveStream.belongsTo(models.Category, { foreignKey: "categoryId" });

models.LiveStream.hasMany(models.Chat, { foreignKey: "liveStreamId" });

// Category

models.Category.hasMany(models.LiveStream, { foreignKey: "categoryId" });

// Report

models.LiveStream.hasMany(models.Report, {foreignKey: "livestreamId"})
models.User.hasOne(models.Report, {foreignKey: "userId"})



export const db = {
   ...models,
   sequelize
}

export async function startTest() {
sequelize.sync();
}