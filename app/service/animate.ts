import { Service } from 'egg';
import {
    categoryLookup,
    authorLookup,
    countLookup,
    eposideLookup,
    slugEposideLookup,
    seasonLookup,
    filterProject,
} from '../utils/aggregation';

interface Query {
    page: number;
    size: number;
    sortBy?: string;
    sortOrder?: number;
    title?: string;
    status?: string;
    isUpdate?: string;
    updateDay?: number;
    area?: string;
    kind?: string;
    tag?: string;
    year?: string;
    author?: string;
}

class AnimateService extends Service {
    async query({
        page,
        size,
        sortBy = '_id',
        sortOrder = -1,
        title,
        status,
        isUpdate,
        updateDay,
        area,
        kind,
        tag,
        year,
        author,
    }: Query) {
        const mongoose = this.app.mongoose;
        const skip: number = (page - 1) * size;
        const limit: number = size;

        const query: any = {};
        title && (query.title = { $regex: title, $options: '$i' });
        status && (query.status = status);
        isUpdate && (query.isUpdate = isUpdate === 'true');
        updateDay && (query.updateDay = updateDay);
        area && (query.area = { $in: [mongoose.Types.ObjectId(area)] });
        year && (query.year = { $in: [mongoose.Types.ObjectId(year)] });
        kind && (query.kind = { $in: [mongoose.Types.ObjectId(kind)] });
        tag && (query.tag = { $in: [mongoose.Types.ObjectId(tag)] });
        author && (query.author = { $in: [mongoose.Types.ObjectId(author)] });

        const result = await this.ctx.model.Animate.aggregate([
            { $match: query },
            ...countLookup,
            {
                $sort: {
                    [sortBy]: sortOrder,
                    _id: 1,
                },
            },
            { $skip: skip },
            { $limit: limit },
            ...eposideLookup,
            ...categoryLookup,
            ...authorLookup,
            ...filterProject,
        ]);

        const total = await this.ctx.model.Animate.find(query).countDocuments();

        return {
            list: result,
            total,
        };
    }

    async info(id: string) {
        const data = await this.ctx.model.Animate.findById(id)
            .populate('area')
            .populate('year')
            .populate('kind')
            .populate('tag');
        return data;
    }

    async create(data: any) {
        const result = await this.ctx.model.Animate.create(data);
        return result;
    }

    async import(data: any) {
        const result = await this.create(data);

        const { eposide = [] } = data;

        eposide.map((item) => {
            item.target = result._id;
            item.onModel = 'Animate';
        });

        const eposideData = await this.ctx.service.eposide.create(eposide).catch(() => false);

        if (!eposideData) {
            await this.destroy([result._id]);
        }

        return eposideData;
    }

    async update(ids: string[], data: any) {
        const query = ids.length > 0 ? { _id: { $in: ids } } : {};
        const result = await this.ctx.model.Animate.updateMany(query, { $set: data });
        return result;
    }

    async destroy(ids: string[]) {
        const query = ids.length > 0 ? { _id: { $in: ids } } : {};
        const result = await this.ctx.model.Animate.deleteMany(query);
        return result;
    }

    // frontend
    async slug(slug: string) {
        const result = await this.ctx.model.Animate.aggregate([
            {
                $match: {
                    slug,
                    status: 'publish',
                },
            },
            seasonLookup('animate'),
            ...countLookup,
            ...categoryLookup,
            ...authorLookup,
            ...slugEposideLookup,
            ...filterProject,
        ]);
        if (!result[0]) throw 'no data';
        return result[0];
    }

    async relative(id: string) {
        const data = await this.ctx.model.Animate.findById(id);
        const { tag } = data;
        const result = await this.ctx.model.Animate.find({
            tag,
        }).limit(20);
        return result.filter((item: any) => item.id !== id);
    }
}

export default AnimateService;
