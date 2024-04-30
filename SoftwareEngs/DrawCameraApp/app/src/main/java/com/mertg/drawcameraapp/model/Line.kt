package com.mertg.drawcameraapp.model

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

data class Line(
    val start: Offset,
    val end: Offset,
    val color: Color,
    val strokeWidth: Float = 1f
)