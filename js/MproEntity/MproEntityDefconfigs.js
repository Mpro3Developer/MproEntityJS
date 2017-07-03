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

MproEntity.authDb = false;
MproEntity.remoteServer = null;
MproEntity.remoteServerTech = null;
MproEntity.serverUrl = "";
MproEntity.serverTech = "";
MproEntity.serverSeted = false;
MproEntity.canCreateTables = true;
MproEntity.indexedDB = false;
MproEntity.indexedDBVersion = 1;

MproEntity.GT = " > ";
MproEntity.GTE = " >= ";
MproEntity.LT = " < ";
MproEntity.LTE = " <= ";
MproEntity.LIKE = " LIKE ";
MproEntity.EQUAL = " = ";
MproEntity.AND = " AND ";
MproEntity.OR = " OR ";

/*
 * Automatic entity creator variables
 */
__projectUser__ = 0;
__projectCod__ = 0;