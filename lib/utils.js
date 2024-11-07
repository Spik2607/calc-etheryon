"use client";

function cn(...args) {
  return args.filter(Boolean).join(" ");
}

exports.cn = cn;
