import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";
import * as path from "path";
import * as os from "os";

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1571145237182_4234";

  // add your egg config in here
  config.middleware = ["errorHandler"];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    proxy: true,
    ipHeaders: "X-Real-Ip, X-Forwarded-For",
    maxProxyCount: 1,
    hostHeaders: "X-Forwarded-Host",
    security: {
      csrf: {
        enable: false,
      },
    },
    multipart: {
      mode: "file",
      fileSize: "20mb",
      tmpdir: path.join(os.tmpdir(), "uploads", appInfo.name),
      cleanSchedule: {
        cron: "0 30 4 * * *",
      },
      fileExtensions: [".ico"],
    },

    validate: {
      convert: true,
      // validateRoot: false,
    },

    redis: {
      client: {
        port: 6379,
        host: "127.0.0.1",
        password: "",
        db: 0,
      },
    },

    mongoose: {
      client: { 
        url: 'mongodb://qinvideo:CPLwtRQsl#gtl!pv$SY5PDBxYREOFmEn@cloud.qinmei.org:27017/qinvideo',
        // url: "mongodb://localhost:27017/qinvideo",
        options: {},
      },
    },

    authUrl: "https://m.qinmei.video/auth/verify", // 邮件验证账户的地址
    salt: "qinmei", // 密码盐值
    tokenSecret: "qinmei", // 登录密钥
    expired: 600, // redis缓存有效期, 是个随机数, 如果是3600, 那么会在3600~7200之间, 即一到两倍之间
    expiredCount: 100, // 接口缓存写入数据库的数量
    caculateCount: 100, // 评论播放等统计接口的计算缓存量
    updateLogUrl:'https://assets.qinmei.org/files/qinvideo.json' //获取系统更新信息的URL
  };

  return {
    ...config,
    ...bizConfig,
  };
};
