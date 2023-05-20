import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../screens/home";
import { Article } from "../screens/article";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Article />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
