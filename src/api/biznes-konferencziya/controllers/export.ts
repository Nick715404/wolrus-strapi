import { Context } from "koa";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export default {
  async exportExcel(ctx: Context) {
    try {
      const data = await strapi.db
        .query("api::biznes-konferencziya.biznes-konferencziya")
        .findMany();

      if (data.length === 0) {
        ctx.throw(404, "Данные не найдены для экспорта");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("БВПП | Регистрация");

      worksheet.columns = Object.keys(data[0]).map((key) => {
        return {
          header: key,
          key: key,
          width: 20,
        };
      });

      data.forEach((item) => {
        worksheet.addRow(item);
      });

      const filePath = path.join(
        __dirname,
        "../../../../../public/business-conf.xlsx"
      );

      console.log(filePath);

      await workbook.xlsx.writeFile(filePath);

      ctx.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      ctx.set(
        "Content-Disposition",
        'attachment; filename="business-conf.xlsx"'
      );
      ctx.body = fs.createReadStream(filePath);
    } catch (error) {
      ctx.throw(500, "Ошибка при экспорте данных");
    }
  },
};
