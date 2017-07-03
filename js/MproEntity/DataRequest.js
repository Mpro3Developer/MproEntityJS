/* 
 * Copyright (C) 2016 Matheus Castello
 *
 * There is no peace only passion
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


MproEntity.DataRequest = function ()
{
    this.Name = "";
    this.Where = "";
    this.IndexWhere = "";
    this.OrderBy = "";
    this.Ix = 2147483647;
    this.NameRef = "";
    this.CodRef = 2147483647;
    this.Limiter = [];
    this.NameRefs = [];
    this.FieldsRefs = [];
    this.LogicVals = [];
    this.Comparators = [];
    this.LogicNexts = [];
    this.Fields = [];
};