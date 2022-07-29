const { Op } = require("sequelize");
const { apiSuccess, apiError, apiSuccessWithData } = require("../../../helpers/apiHelpers");
const { service_plan, service_plan_days } = require("../../../models");
const fs = require('fs')
const path = require('path')
const baseDir = path.join(__dirname, "../../../tmp/images");
exports.createServicePlan = async (req, res) => {
  let { title, price_per_hour, description, image, status, days } = req.body;
  //   console.log(req.body)
  try {
    let plan = await service_plan.create({
      title: title,
      prices_per_hour: price_per_hour,
      description: description,
      image: req.file.originalname,
      status: true,
    });

    // if (!plan.id){ return res.status(404).json(apiError("Not found"));}
    // else {
    console.log(days);
    days.forEach(async (e) => {
      let addDays = await service_plan_days.create({
        service_id: plan.id,
        days: e.day,
        start_time: e.startTime,
        end_time: e.endTime,
      });
      //
      console.log(e);
    });

    return res.status(200).json(apiSuccess("Service plan added successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.editServicePlan = async (req, res) => {
  let { title, price_per_hour, description, image, status, days } = req.body;
  //   console.log(req.body)
  try {
    let plan = await service_plan.findOne({
      where: { id: req.params.id },
    });
    if (!plan) return res.status(404).json(apiError("not found"));
    else {
        fs.unlink(baseDir + "/" + plan.image, err => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("image deleted")
            }
        })
      plan.title = title;
      plan.description = description;
      plan.image = req.file.originalname;
      plan.prices_per_hour = price_per_hour;
      await plan.save();
    }

    // let serviceDays = await service_plan_days.findOne({ where: { service: plan.id } });
    days.forEach(async (e) => {
      let updateDays = await service_plan_days.update(
        {
          start_time: e.startTime,
          end_time: e.endTime,
        },
        {
          where: { service_id: plan.id, days: req.query.days },
        }
      );

      console.log(e);
    });

    return res.status(200).json(apiSuccess("Service plan updated successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.getAllPlans=async(req,res)=>{

        try {
            let whereStatement = {};
            const { status, startDate, endDate, search, page, entries } = req.query;
            if (status) {
              whereStatement.status = { [Op.like]: `%${status}%` };
            }
            if (startDate && endDate) {
              whereStatement.createdAt = { [Op.between]: [startDate, endDate] };
            }
            if (search) {
    //           whereStatement={
    //    ...whereStatement,
    //    [Op.or]:[
    //        title = { [Op.like]: `%${search}%` },
    //        user={ [Op.like]: search}

    //    ]}
    whereStatement.title={[Op.like]:`%${search}%`}
    }
        
            var currentpage = page ? parseInt(page) : 1;
        
            var per_page = entries ? parseInt(entries) : 10;
        
            let {
              docs: data,
              total,
              pages,
            } = await service_plan.paginate({
              where: whereStatement,
              page: currentpage,
              paginate: per_page,
            });
        
            let response = {
              data,
              current_page: currentpage,
              total,
              per_page: entries,
              last_page: pages,
            };
            return res
              .status(200)
              .json(apiSuccessWithData("subscription listing", response));
          } catch (error) {
            console.log(error);
            return res.status(500).json(error);
          }
        
}

exports.updatePlanStatus = async (req, res) => {
    try {

        let isExist = await service_plan.findOne({
            where: {
                id: req.params.id,
            }
        })
        console.log(isExist)
        if (!isExist) return res.status(404).json(apiError("not exist"))

        if (req.body.status == 1) {

            isExist.status = 1
            await isExist.save()
            return res.status(200).json(apiSuccess("service plan Active"));
        }
        else {
            isExist.status = 0
            await isExist.save()
            return res.status(200).json(apiSuccess("service plan Inactive"))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)

    }

  };