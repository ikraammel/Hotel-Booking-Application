package com.ikram.hotel.controller;

import com.ikram.hotel.exception.RoleAlreadyExistException;
import com.ikram.hotel.model.Role;
import com.ikram.hotel.model.User;
import com.ikram.hotel.service.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.FOUND;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final IRoleService roleService;

    @GetMapping("/all-roles")
    public ResponseEntity<List<Role>> getAllRoles(){
        return new ResponseEntity<>(roleService.getRoles(), FOUND);
    }

    @PostMapping("/create-new-role")
    public ResponseEntity<String> createRole(@RequestBody Role role){
        try{
            roleService.createRole(role);
            return ResponseEntity.ok("New role created successfully ");
        }catch (RoleAlreadyExistException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable Long roleId){
        roleService.deleteRole(roleId);
    }

    @DeleteMapping("/remove/all-users-from-role/{roleId}")
    public Role removeAllUsersFromRole(@PathVariable Long roleId){
        return roleService.removeAllUsersFromRole(roleId);
    }

    @DeleteMapping("/remove/{userId}/{roleId}")
    public User removeUserFromRole(@PathVariable Long userId,@PathVariable Long roleId){
        return roleService.removeUserFromRole(userId,roleId);
    }

    @PostMapping("/assign-user-to-role")
    public User assignRoleToUser(@RequestParam Long userId,@RequestParam Long roleId){
        return roleService.assignRoleToUser(userId,roleId);
    }
}
