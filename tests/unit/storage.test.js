import { Assert } from '../runner.js';
import { StorageService } from '../../src/core/storage.js';

export const storageTests = {
    'should save and retrieve an item successfully': async () => {
        const testKey = 'test_key_1';
        const testData = { hello: 'world', num: 42 };
        
        const saveResult = StorageService.setItem(testKey, testData);
        Assert.isTrue(saveResult, "setItem should return true on success");

        const retrieved = StorageService.getItem(testKey);
        Assert.equals(retrieved.hello, 'world');
        Assert.equals(retrieved.num, 42);
    },

    'should return default value if key does not exist': async () => {
        const retrieved = StorageService.getItem('non_existent_key', 'fallback');
        Assert.equals(retrieved, 'fallback', "Should return default value");
    },

    'should remove item successfully': async () => {
        const testKey = 'test_key_delete';
        StorageService.setItem(testKey, "temp");
        StorageService.removeItem(testKey);
        
        const retrieved = StorageService.getItem(testKey);
        Assert.equals(retrieved, null, "Item should be null after removal");
    },

    'should only clear mindmate app storage': async () => {
        localStorage.setItem('other_app_key', 'keep me');
        StorageService.setItem('mindmate_test', 'delete me');

        StorageService.clearAppStorage();

        Assert.equals(localStorage.getItem('other_app_key'), 'keep me', "Should not delete other app data");
        Assert.equals(StorageService.getItem('mindmate_test'), null, "Should delete mindmate data");
    }
};
