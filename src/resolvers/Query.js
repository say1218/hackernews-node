function feed(parent, args, context, info) {

    console.log('args', args);
    const where = args.filter
    ? {
      OR: [
        { description: { contains: args.filter } },
        { url: { contains: args.filter } },
      ],
    }
    : {}

  const links = context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  const count = context.prisma.link.count({ where })

  return {
    links,
    count,
  }
}

  
module.exports = {
    feed,
}