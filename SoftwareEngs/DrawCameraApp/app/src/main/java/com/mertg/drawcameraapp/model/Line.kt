package com.mertg.drawcameraapp.model

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color

data class Line(
    val start: Offset,
    val end: Offset,
    val color: Color,
    val strokeWidth: Float // Kalem kalınlığı bilgisi eklendi
)
