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
        if($this->obj->NameRef === "")
        {
            $sql = "SELECT * FROM ".$this->obj->Name." " . ($this->obj->Where === "" ? "ORDER BY " : (" WHERE (".$this->obj->Where.") ORDER BY ")).$this->obj->OrderBy;
        }
        else
        {
            $sql =  "SELECT * FROM ".$this->obj->Name." WHERE cod in ".
                    "(SELECT codref FROM Reference WHERE class = '".$this->obj->NameRef."' and cod = ".
                    $this->obj->CodRef." AND classref = '".$this->obj->Name."' ". ($this->obj->Ix !== 2147483647 ? " AND ix = ".$this->obj->Ix." " : "").") "
                    ." ".
                    ($this->obj->Where === "" ? "ORDER BY " : (" AND (".$this->obj->Where.") ORDER BY ")).$this->obj->OrderBy;
        }
        
        if(count($this->obj->Limiter))
        {
            $sql .= " LIMIT " . $this->obj->Limiter[0] . ", " . $this->obj->Limiter[1];
        }
        
        return $sql;
    }

    public function selectWhere() 
    {
        $sql = "SELECT ".$this->obj->Name.".cod, ";
        $sqlInner = "";
        $sqlWhere = "";
        
        for($i = 0; $i < count($this->obj->Fields); $i++)
        {
            $sql .= $this->obj->Name.".".$this->obj->Fields[$i].", ";
        }
        
        $sql = preg_replace('/, $/', "", $sql);
        $sql .= " FROM ".$this->obj->Name." ";
        
        // inner joins
        for($i = 0; $i < count($this->obj->NameRefs); $i++)
        {
            $sqlInner .=    " INNER JOIN Reference ON Reference.cod = ".
                            $this->obj->Name.".cod ".
                            "INNER JOIN ".$this->obj->NameRefs[$i]." ON ".
                            $this->obj->NameRefs[$i].".cod = Reference.codref AND Reference.classref = '".
                            $this->obj->NameRefs[$i]."' ";
            
            $sqlWhere .=    "".$this->obj->NameRefs[$i].".".$this->obj->FieldsRefs[$i]." ".
                            $this->obj->Comparators[$i]." ".
                            (gettype($this->obj->LogicVals[$i]) == "string" ? "'".
                                    ($this->obj->Comparators[$i] === " LIKE " ? "%" : "")
                                    .$this->obj->LogicVals[$i]
                                    .($this->obj->Comparators[$i] === " LIKE " ? "%" : "")."'" : $this->obj->LogicVals[$i]).
                            " ".($this->obj->LogicNexts[$i] == null ? "" : $this->obj->LogicNexts[$i]);
        }
        
        $sql .= $sqlInner." WHERE ".$sqlWhere." ".$this->obj->OrderBy;
        
        return $sql;
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

    public function createRefTable() 
    {
        return "CREATE TABLE IF NOT EXISTS Reference (class TEXT, classref TEXT, ix INTEGER, cod INTEGER, codref INTEGER, PRIMARY KEY(class, classref, cod, codref));";
    }

}
