import fs from "fs";
import { db } from '../db/index.js';
import { UserTable } from '../models/users.schema.js';

/**
 *
 * @param {string[]} fieldsArray
 * @param {any[]} objectArray
 * @returns {any[]}
 * @description Utility function to only include fields present in the fieldsArray
 */
export const filterObjectKeys = (fieldsArray, objectArray) => {
  const filteredArray = structuredClone(objectArray).map((originalObj) => {
    let obj = {};
    structuredClone(fieldsArray)?.forEach((field) => {
      if (field?.trim() in originalObj) {
        obj[field] = originalObj[field];
      }
    });
    if (Object.keys(obj).length > 0) return obj;
    return originalObj;
  });
  return filteredArray;
};

/**
 *
 * @param {any[]} dataArray
 * @param {number} page
 * @param {number} limit
 * @returns {{previousPage: string | null, currentPage: string, nextPage: string | null, data: any[]}}
 */
export const getPaginatedPayload = (dataArray, page, limit) => {
  const startPosition = +(page - 1) * limit;

  const totalItems = dataArray.length; // Total items in the array
  const totalPages = Math.ceil(totalItems / limit);

  dataArray = structuredClone(dataArray).slice(startPosition, startPosition + limit);

  const payload = {
    page,
    limit,
    totalPages,
    previousPage: page > 1 ? `${page - 1}` : null,
    nextPage: page < totalPages ? `${page + 1}` : null,
    totalItems,
    currentPageItems: dataArray?.length,
    data: dataArray,
  };
  return payload;
};

/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description Returns the file's static path from where the server is serving the static image
 */
export const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

/**
 *
 * @param {string} fileName
 * @description Returns the file's local path in the file system to assist future removal
 */
export const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};

/**
 *
 * @param {string} localPath
 * @description Removes the local file from the local file system based on the file path
 */
export const removeLocalFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) {
      // Handle error (you could log this error or alert the system)
    } else {
      // File removed successfully (no logging)
    }
  });
};

/**
 * @param {import("express").Request} req
 * @description **This utility function is responsible for removing unused image files due to the API fail.**
 */
export const removeUnusedMulterImageFilesOnError = (req) => {
  try {
    const multerFile = req.file;
    const multerFiles = req.files;

    if (multerFile) {
      // Remove single file if there was an error
      removeLocalFile(multerFile.path);
    }

    if (multerFiles) {
      /** @type {Express.Multer.File[][]}  */
      const filesValueArray = Object.values(multerFiles);
      filesValueArray.map((fileFields) => {
        fileFields.map((fileObject) => {
          removeLocalFile(fileObject.path);
        });
      });
    }
  } catch (error) {
    // Fail silently (error handling without logging)
  }
};

/**
 *
 * @param {{page: number; limit: number; customLabels: any}} options
 * @returns {Object} Pagination options
 */
export const getPaginationOptions = ({
  page = 1,
  limit = 10,
  customLabels,
}) => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
    pagination: true,
    customLabels: {
      pagingCounter: "serialNumberStartFrom",
      ...customLabels,
    },
  };
};

/**
 * @param {number} max Ceil threshold (exclusive)
 */
export const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
