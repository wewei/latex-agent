import { Request } from 'express';
import { ParamsOptions } from 'latex-agent-dao/dist/dao/BaseDao';
export function transferParamOption(req: Request): ParamsOptions|undefined {
  try{
    if(req.query){
      let pageNo = req.query.page ? parseInt(req.query.page as string) : -1;
      let pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : -1;
      const options: ParamsOptions = {
        offset: pageNo < 1 ? undefined : (pageNo - 1) * (pageSize),
        limit: pageSize < 1 ? 20 : pageSize,
        orderBy: req.query.orderBy as string || undefined,
        desc: req.query.order === 'desc'
      };
      return options;
    }
    return {};
  }catch(error){
    console.error('参数转换错误:', error);
    return undefined;
  }
}
