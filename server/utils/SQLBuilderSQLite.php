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

require_once 'SQLBuilder.php';

class SQLBuilderSQLite implements SQLBuilder
{
    private $obj;
    
    public function delete() 
    {
        $sqls = array();
        if($this->obj->NameRef === "")
        {
            $sqls[] = "DELETE FROM ".$this->obj->Name." WHERE cod = ".$this->obj->Cod.";";
            $sqls[] = "DELETE FROM Reference WHERE cod = ".$this->obj->Cod."  AND class = '".$this->obj->Name."';";
        }
        else
        {
            $sqls[] = "DELETE FROM Reference WHERE cod = ".$this->obj->CodRef." AND codref = ".
                        $this->obj->Cod." AND class = '".
                        $this->obj->NameRef."' AND classref = '".$this->obj->Name."';";
        }
        return $sqls;
    }

    public function insertRef() 
    {
        return "INSERT INTO Reference VALUES('".
                $this->obj->NameRef."', '".
                $this->obj->Name."', ".
                $this->obj->Ix.", ".
                $this->obj->CodRef.", ".
                $this->obj->Cod.");";
    }
    
    public function insert() 
    {
        return "INSERT INTO ".$this->obj->Name." VALUES(NULL, "
                .
                $this->obj->Fields
                .")";
    }

    public function selectAll() 
    {
        
    }

    public function selectWhere() 
    {
        
    }

    public function setJSONObject($obj) 
    {
        $this->obj = $obj;
    }

    public function update() 
    {
        $update = "UPDATE ".$this->obj->Name." SET ".$this->obj->Fields;
        $update .= " WHERE cod = ".$this->obj->Cod;
        
        return $update;
    }

    public function createTable() 
    {
        $sqls = array();
        
        $sqls[] = "CREATE TABLE ".$this->obj->Name." (cod INTEGER PRIMARY KEY)";
        
        for($i = 0; $i < count($this->obj->Fields); $i++) 
        {
            $sqls[] = "ALTER TABLE ".$this->obj->Name." ADD ".$this->obj->Fields[$i]." ".$this->obj->Types[$i];
        }
        
        return $sqls;
    }
}
