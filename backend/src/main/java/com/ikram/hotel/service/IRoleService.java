package com.ikram.hotel.service;

import com.ikram.hotel.model.Role;
import com.ikram.hotel.model.User;

import java.util.List;

public interface IRoleService {

    List<Role> getRoles();
    Role createRole(Role role);
    void deleteRole(Long id);
    Role findRoleByName(String name);
    User removeUserFromRole(Long userId, Long roleId);
    User assignRoleToUser(Long userId, Long roleId);
    Role removeAllUsersFromRole(Long roleId);
}
