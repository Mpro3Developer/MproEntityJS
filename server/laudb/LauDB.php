<?php

/*
 * Copyright (C) 2015 Matheus Castello
 * 
 *  There is no peace only passion
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

interface LauDB 
{
    function __construct($filename);
    public function query($cmd);
    public function noReturnDataQuery($cmd);
    public function row($row, $table);
    public function execute($cmd);
    public function getLastInsertRowid();
    public function rowCount();
    public function prox();
    public function getActualObjectRow();
    public function close();
}
