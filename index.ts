Product.totals = (productid, clientid, isAdmin, productnumber, next) => {
  if (isAdmin) {
    Request.app.models.appuser.login(
      {
        email: "admin@therealdeal.com",
        password: "pass12345",
      },
      (err, authInfo) => {
        let where = { id: productid };
        if (productnumber && clientid) {
          where.and = [{ clientid }, { productnumber }];
        }
        let filter = {
          where: where,
          include: {
            relation: "feedbacks",
            scope: {
              where: { approved: true },
              include: "ratings",
            },
          },
        };
        Product.findOne(filter, (err, product) => {
          if (err) {
            return next(err);
          }
          if (!product) {
            return next();
          }
          var totalStars = 0,
            totalFeedbackCount = 0,
            feedbacks = product.feedbacks(),
            critTotals = {},
            starTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          feedbacks.forEach(function (feedback, index) {
			totalStars += feedbacks[index].totalratingscore;
			let ratings = feedbacks[index].ratings();
			console.log(ratings);

            if (ratings) {
              for (var r = 0; r < ratings.length; r++)
			  {
			if (critTotals[ratings[r].critid]) {
				critTotals[ratings[r].critid].count += 1;
				critTotals[ratings[r].critid].scoreTotal += ratings[r].score;
                } else {
				critTotals[ratings[r].critid] = {
				count: 1,
				scoreTotal: ratings[r].score,
				};
                }
              }
              console.log(critTotals);
              if (Math.round(feedbacks[i].totalratingscore * 10) / 10 == 1)
			  {
                starTotals[1] += 1;
              }
              if (Math.round(feedbacks[i].totalratingscore * 10) / 10 == 2){
                starTotals[2] += 1;
              }
              if (Math.round(feedbacks[i].totalratingscore * 10) / 10 == 3) {
                starTotals[3] += 1;
              }
              if (Math.round(feedbacks[i].totalratingscore * 10) / 10 == 4){
                starTotals[4] += 1;
              }
              if (Math.round(feedbacks[i].totalratingscore * 10) / 10 == 5) {
                starTotals[5] += 1;
              }
              if (feedbacks[i].totalratingscore) {
                totalFeedbackCount += 1;
              }
            }
          });
          var totalProductScore = totalStars / totalFeedbackCount;

          var result = {
            totalratingscore: Math.round(totalProductScore * 10) / 10,
            startotals: starTotals,
            crittotals: critTotals,
            totalFeedbackCount: totalFeedbackCount,
          };

          next(err, result);
        });
      	}
    );
  	}
};
