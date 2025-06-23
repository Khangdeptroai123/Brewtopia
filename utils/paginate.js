const paginate = async (Model, query, page, limit) => {
  const skip = (page - 1) * limit;
  const [results, total] = await Promise.all([
    Model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }), // sort mới nhất lên đầu
    Model.countDocuments(query),
  ]);
  return {
    results,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
module.exports = paginate;
