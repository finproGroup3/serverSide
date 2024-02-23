const { Store, City, Province } = require('../models');

class StoreController {
    static async getAllStores(req, res, next) {
        try {
            const stores = await Store.findAll({
                include: [
                    { model: City, attributes: ['name'] }, // Include city with name attribute
                    { model: Province, attributes: ['name'] } // Include province with name attribute
                ]
            });

            // Extract required data and send response
            const formattedStores = stores.map(store => ({
                id: store.id,
                bankAccount: store.bankAccount,
                bankName: store.bankName,
                city: store.City.name, // Access city name from included association
                province: store.Province.name, // Access province name from included association
                address: store.address
            }));

            res.status(200).json({ status: 'success', data: formattedStores, message: 'Stores retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async editStore(req, res, next) {
        try {
            const { storeId } = req.params;
            const { bankAccount, bankName, cityId, provinceId, address } = req.body;

            // Find the store by ID
            const store = await Store.findByPk(storeId);

            if (!store) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Store not found' });
            }

            // Update the store
            await store.update({ bankAccount, bankName, cityId, provinceId, address });

            res.status(200).json({ status: 'success', data: store, message: 'Store updated successfully' });
        } catch (error) {
            next(error);
        }
    }
    
    static async getById(req, res, next) {
        try {
            const { storeId } = req.params;

            // Find the store by ID
            const store = await Store.findByPk(storeId, {
                include: [
                    { model: City, attributes: ['name'] }, // Include city with name attribute
                    { model: Province, attributes: ['name'] } // Include province with name attribute
                ]
            });

            if (!store) {
                return res.status(404).json({ status: 'failed', code: 404, message: 'Store not found' });
            }

            res.status(200).json({ status: 'success', data: store, message: 'Store retrieved successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StoreController;
