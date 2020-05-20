import {Model, DataTypes, Sequelize} from 'sequelize'

import bcrypt from 'bcryptjs'
import {now} from 'moment'

export const initUserModel = sequelize => {
  class UserModel extends Model {

    async comparePassword({password}) {
      return await bcrypt.compare(password, this.password)
    }

    static async findByCredentials({username, password}) {
      const user = await this.findOne({where: {
          username
        }});
      if (!user) {
        return Promise.reject(`User with username ${username} doesn't exist`);
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return Promise.reject(`Invalid Password`);
      }
      return user;
    }

  }

  UserModel.init({
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    avatarUrl: {
      type: DataTypes.STRING,
      defaultValue: 'https://i2.wp.com/www.fablab-lyon.fr/wp-content/uploads/2015/09/default-avatar-2' +
          '00x200.jpg?fit=200%2C220'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isLivestream: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    transcoder: {
      type: DataTypes.STRING
    },
    pushDataServer: {
      type: DataTypes.STRING
    },
    streamName: {
      type: DataTypes.STRING
    },
    hls: {
      type: DataTypes.STRING
    },
    registeredDate: {
      type: DataTypes.DATE,
      defaultValue: now()
    }
  }, {
    hooks: {
      async beforeCreate(user) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 8)
        }
      },
      async beforeUpdate(user) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 8)
        }
      }
    },
    createdAt: false,
    updatedAt: false,
    sequelize,
    tableName: "User",
    modelName: "User",
    getterMethods: {
      responseData() {
        return {
          userId: this.userId,
          username: this.username,
          avatarUrl: this.avatarUrl,
          transcoder: this.transcoder,
          pushDataServer: this.pushDataServer,
          streamName: this.streamName
        }
      }
    }
  });
  return UserModel;
}