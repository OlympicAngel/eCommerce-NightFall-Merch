const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const express = require('express');

const permissionMap = {
  "manager": 1, //partial permission
  "admin": 2, //full permission
}

/**
 * Auth permissions , default to auth admin only! can be changed via call with {permission:"manager"}
 * @param {{permission:Number|"admin"|"manager"} | {}} reqOrConf 
 * @param {import('express').Response | undefined} res 
 * @param {import('express').NextFunction | undefined} next 
 * @returns {Promise}
 */
module.exports = (reqOrConf, res, next) => {
  //check if first param is a request - use a normal middleware
  const isUsedAsDirectMiddleware = !reqOrConf.permission;
  if (isUsedAsDirectMiddleware)
    return AuthManager(reqOrConf, res, next);

  //else - return a middleware and set it's permission as given
  const permissionVal = (arguments[0]?.permission) || 1;
  let permission = permissionVal;
  //if given a string key - get it's value via map
  if (typeof permissionVal === "string")
    permission = permissionMap[permissionVal];

  /**
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @param {import('express').NextFunction} next 
   * @returns {Promise}
   */
  return (req, res, next) => {
    AuthManager(req, res, next, permission)
  };
};

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import('express').NextFunction} next 
 * @param {Number} permission - the min permission level needed, defaulted to the highest permission
 * @returns {Promise}
 */
async function AuthManager(req, res, next, permission = Object.keys(permissionMap).length) {
  const noAccessErr = { success: false, message: "אין גישה!" }

  noAccessErr.message += ` צריך להיות ` + ["מנהל", "אדמין"][permission - 1] + "."


  const { token } = req.cookies;
  console.log(token)
  if (!token)
    return res.status(401).json(noAccessErr);

  try {
    //decode token to get its data
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const manager = await Manager.findById(decode.manager);

    console.log(!manager, manager.permission < permission)

    if (!manager ||     //make sure user is indeed manager 
      (manager.permission < permission)) //prevent access to all users that their permission is lower then needed
      return res.status(401).json(noAccessErr);

    //bind manger & token onto request for later use
    req.manager = manager;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError')
      return res.status(401).json(noAccessErr);

    if (error.name === 'TokenExpiredError')
      return res.status(401).json({
        success: false,
        message: 'משתמש נותק - יש להתחבר שנית!',
        timeout: true
      });

    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
}